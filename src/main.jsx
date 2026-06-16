import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { supabase } from './supabaseClient'
import './styles.css'

const emptyAluno = {
  nome: '',
  data_nascimento: '',
  cpf: '',
  rg: '',
  telefone: '',
  endereco: '',
  observacoes: '',
  responsavel_nome: '',
  responsavel_cpf: '',
  responsavel_telefone: '',
  responsavel_email: '',
  responsavel_endereco: ''
}

function App() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [aba, setAba] = useState('dashboard')
  const [loading, setLoading] = useState(false)

  const [alunos, setAlunos] = useState([])
  const [responsaveis, setResponsaveis] = useState([])
  const [cursos, setCursos] = useState([])
  const [turmas, setTurmas] = useState([])
  const [matriculas, setMatriculas] = useState([])

  const [alunoForm, setAlunoForm] = useState(emptyAluno)
  const [cursoForm, setCursoForm] = useState({ nome: '', descricao: '' })
  const [turmaForm, setTurmaForm] = useState({ curso_id: '', nome: '', dias_horarios: '', vagas: 20, periodo: '' })
  const [matriculaForm, setMatriculaForm] = useState({ aluno_id: '', turma_id: '', observacoes: '' })
  const [busca, setBusca] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) carregarDados()
  }, [session])

  async function login(e) {
    e.preventDefault()
    setErro('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) setErro('E-mail ou senha inválidos.')
  }

  async function sair() {
    await supabase.auth.signOut()
  }

  async function carregarDados() {
    setLoading(true)
    const [al, resp, cur, tur, mat] = await Promise.all([
      supabase.from('alunos').select('*, responsaveis(nome, telefone)').order('created_at', { ascending: false }),
      supabase.from('responsaveis').select('*').order('created_at', { ascending: false }),
      supabase.from('cursos').select('*').order('nome'),
      supabase.from('turmas').select('*, cursos(nome)').order('created_at', { ascending: false }),
      supabase.from('matriculas').select('*, alunos(nome), turmas(nome, cursos(nome))').order('created_at', { ascending: false })
    ])
    setAlunos(al.data || [])
    setResponsaveis(resp.data || [])
    setCursos(cur.data || [])
    setTurmas(tur.data || [])
    setMatriculas(mat.data || [])
    setLoading(false)
  }

  async function salvarAluno(e) {
    e.preventDefault()
    setErro('')
    let responsavel_id = null

    if (alunoForm.responsavel_nome.trim()) {
      const { data, error } = await supabase.from('responsaveis').insert({
        nome: alunoForm.responsavel_nome,
        cpf: alunoForm.responsavel_cpf,
        telefone: alunoForm.responsavel_telefone,
        email: alunoForm.responsavel_email,
        endereco: alunoForm.responsavel_endereco
      }).select().single()
      if (error) return setErro(error.message)
      responsavel_id = data.id
    }

    const { error } = await supabase.from('alunos').insert({
      nome: alunoForm.nome,
      data_nascimento: alunoForm.data_nascimento || null,
      cpf: alunoForm.cpf,
      rg: alunoForm.rg,
      telefone: alunoForm.telefone,
      endereco: alunoForm.endereco,
      observacoes: alunoForm.observacoes,
      responsavel_id
    })
    if (error) return setErro(error.message)
    setAlunoForm(emptyAluno)
    carregarDados()
  }

  async function salvarCurso(e) {
    e.preventDefault()
    const { error } = await supabase.from('cursos').insert(cursoForm)
    if (error) return setErro(error.message)
    setCursoForm({ nome: '', descricao: '' })
    carregarDados()
  }

  async function salvarTurma(e) {
    e.preventDefault()
    const { error } = await supabase.from('turmas').insert({
      ...turmaForm,
      vagas: Number(turmaForm.vagas || 0)
    })
    if (error) return setErro(error.message)
    setTurmaForm({ curso_id: '', nome: '', dias_horarios: '', vagas: 20, periodo: '' })
    carregarDados()
  }

  async function salvarMatricula(e) {
    e.preventDefault()
    const turma = turmas.find(t => t.id === matriculaForm.turma_id)
    const ocupadas = matriculas.filter(m => m.turma_id === matriculaForm.turma_id && m.status !== 'cancelada').length
    if (turma && turma.vagas > 0 && ocupadas >= turma.vagas) {
      return setErro('Essa turma já atingiu o limite de vagas.')
    }
    const { error } = await supabase.from('matriculas').insert({
      aluno_id: matriculaForm.aluno_id,
      turma_id: matriculaForm.turma_id,
      observacoes: matriculaForm.observacoes,
      status: 'ativa'
    })
    if (error) return setErro(error.message)
    setMatriculaForm({ aluno_id: '', turma_id: '', observacoes: '' })
    carregarDados()
  }

  async function renovarMatricula(id) {
    const { error } = await supabase.from('matriculas').update({
      status: 'renovada',
      data_renovacao: new Date().toISOString().slice(0, 10)
    }).eq('id', id)
    if (error) return setErro(error.message)
    carregarDados()
  }

  async function cancelarMatricula(id) {
    const { error } = await supabase.from('matriculas').update({ status: 'cancelada' }).eq('id', id)
    if (error) return setErro(error.message)
    carregarDados()
  }

  const alunosFiltrados = alunos.filter(a => a.nome.toLowerCase().includes(busca.toLowerCase()))
  const relatorioPorStatus = useMemo(() => {
    return matriculas.reduce((acc, m) => {
      acc[m.status] = (acc[m.status] || 0) + 1
      return acc
    }, {})
  }, [matriculas])

  if (!session) {
    return (
      <main className="login-page">
        <form className="card login-card" onSubmit={login}>
          <h1>Sistema de Matrículas</h1>
          <p>Projeto social da igreja</p>
          <label>E-mail</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
          <label>Senha</label>
          <input value={senha} onChange={e => setSenha(e.target.value)} type="password" required />
          {erro && <div className="erro">{erro}</div>}
          <button>Entrar</button>
        </form>
      </main>
    )
  }

  return (
    <main>
      <header className="topbar">
        <div>
          <h1>Matrículas</h1>
          <span>Projeto Social da Igreja</span>
        </div>
        <button className="secondary" onClick={sair}>Sair</button>
      </header>

      <nav className="tabs">
        {['dashboard', 'alunos', 'cursos', 'turmas', 'matriculas', 'relatorios'].map(item => (
          <button key={item} className={aba === item ? 'active' : ''} onClick={() => setAba(item)}>
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </nav>

      {erro && <div className="erro page-erro">{erro}</div>}
      {loading && <p className="loading">Carregando dados...</p>}

      {aba === 'dashboard' && (
        <section className="grid cards">
          <div className="card"><h2>{alunos.length}</h2><p>Alunos cadastrados</p></div>
          <div className="card"><h2>{cursos.length}</h2><p>Cursos</p></div>
          <div className="card"><h2>{turmas.length}</h2><p>Turmas</p></div>
          <div className="card"><h2>{matriculas.filter(m => m.status === 'ativa').length}</h2><p>Matrículas ativas</p></div>
        </section>
      )}

      {aba === 'alunos' && (
        <section className="grid two">
          <form className="card" onSubmit={salvarAluno}>
            <h2>Novo aluno</h2>
            <input placeholder="Nome do aluno" value={alunoForm.nome} onChange={e => setAlunoForm({...alunoForm, nome: e.target.value})} required />
            <input type="date" value={alunoForm.data_nascimento} onChange={e => setAlunoForm({...alunoForm, data_nascimento: e.target.value})} />
            <input placeholder="CPF" value={alunoForm.cpf} onChange={e => setAlunoForm({...alunoForm, cpf: e.target.value})} />
            <input placeholder="RG" value={alunoForm.rg} onChange={e => setAlunoForm({...alunoForm, rg: e.target.value})} />
            <input placeholder="Telefone" value={alunoForm.telefone} onChange={e => setAlunoForm({...alunoForm, telefone: e.target.value})} />
            <input placeholder="Endereço" value={alunoForm.endereco} onChange={e => setAlunoForm({...alunoForm, endereco: e.target.value})} />
            <textarea placeholder="Observações" value={alunoForm.observacoes} onChange={e => setAlunoForm({...alunoForm, observacoes: e.target.value})} />
            <h3>Responsável, se houver</h3>
            <input placeholder="Nome do responsável" value={alunoForm.responsavel_nome} onChange={e => setAlunoForm({...alunoForm, responsavel_nome: e.target.value})} />
            <input placeholder="CPF do responsável" value={alunoForm.responsavel_cpf} onChange={e => setAlunoForm({...alunoForm, responsavel_cpf: e.target.value})} />
            <input placeholder="Telefone do responsável" value={alunoForm.responsavel_telefone} onChange={e => setAlunoForm({...alunoForm, responsavel_telefone: e.target.value})} />
            <input placeholder="E-mail do responsável" value={alunoForm.responsavel_email} onChange={e => setAlunoForm({...alunoForm, responsavel_email: e.target.value})} />
            <input placeholder="Endereço do responsável" value={alunoForm.responsavel_endereco} onChange={e => setAlunoForm({...alunoForm, responsavel_endereco: e.target.value})} />
            <button>Salvar aluno</button>
          </form>

          <div className="card">
            <h2>Alunos</h2>
            <input placeholder="Buscar aluno..." value={busca} onChange={e => setBusca(e.target.value)} />
            <div className="list">
              {alunosFiltrados.map(a => (
                <div className="item" key={a.id}>
                  <strong>{a.nome}</strong>
                  <span>{a.telefone || 'Sem telefone'}</span>
                  <small>Responsável: {a.responsaveis?.nome || 'Não informado'}</small>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {aba === 'cursos' && (
        <section className="grid two">
          <form className="card" onSubmit={salvarCurso}>
            <h2>Novo curso</h2>
            <input placeholder="Nome do curso" value={cursoForm.nome} onChange={e => setCursoForm({...cursoForm, nome: e.target.value})} required />
            <textarea placeholder="Descrição" value={cursoForm.descricao} onChange={e => setCursoForm({...cursoForm, descricao: e.target.value})} />
            <button>Salvar curso</button>
          </form>
          <div className="card">
            <h2>Cursos cadastrados</h2>
            {cursos.map(c => <div className="item" key={c.id}><strong>{c.nome}</strong><span>{c.descricao}</span></div>)}
          </div>
        </section>
      )}

      {aba === 'turmas' && (
        <section className="grid two">
          <form className="card" onSubmit={salvarTurma}>
            <h2>Nova turma</h2>
            <select value={turmaForm.curso_id} onChange={e => setTurmaForm({...turmaForm, curso_id: e.target.value})} required>
              <option value="">Selecione o curso</option>
              {cursos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
            <input placeholder="Nome da turma. Ex: Turma A" value={turmaForm.nome} onChange={e => setTurmaForm({...turmaForm, nome: e.target.value})} required />
            <input placeholder="Dias e horários" value={turmaForm.dias_horarios} onChange={e => setTurmaForm({...turmaForm, dias_horarios: e.target.value})} />
            <input placeholder="Período. Ex: 2026.1" value={turmaForm.periodo} onChange={e => setTurmaForm({...turmaForm, periodo: e.target.value})} />
            <input type="number" placeholder="Vagas" value={turmaForm.vagas} onChange={e => setTurmaForm({...turmaForm, vagas: e.target.value})} />
            <button>Salvar turma</button>
          </form>
          <div className="card">
            <h2>Turmas</h2>
            {turmas.map(t => {
              const ocupadas = matriculas.filter(m => m.turma_id === t.id && m.status !== 'cancelada').length
              return <div className="item" key={t.id}>
                <strong>{t.cursos?.nome} - {t.nome}</strong>
                <span>{t.dias_horarios}</span>
                <small>Período: {t.periodo || '-'} | Vagas: {ocupadas}/{t.vagas}</small>
              </div>
            })}
          </div>
        </section>
      )}

      {aba === 'matriculas' && (
        <section className="grid two">
          <form className="card" onSubmit={salvarMatricula}>
            <h2>Nova matrícula</h2>
            <select value={matriculaForm.aluno_id} onChange={e => setMatriculaForm({...matriculaForm, aluno_id: e.target.value})} required>
              <option value="">Selecione o aluno</option>
              {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
            <select value={matriculaForm.turma_id} onChange={e => setMatriculaForm({...matriculaForm, turma_id: e.target.value})} required>
              <option value="">Selecione a turma</option>
              {turmas.map(t => <option key={t.id} value={t.id}>{t.cursos?.nome} - {t.nome}</option>)}
            </select>
            <textarea placeholder="Observações" value={matriculaForm.observacoes} onChange={e => setMatriculaForm({...matriculaForm, observacoes: e.target.value})} />
            <button>Matricular</button>
          </form>
          <div className="card">
            <h2>Histórico de matrículas</h2>
            {matriculas.map(m => (
              <div className="item" key={m.id}>
                <strong>{m.alunos?.nome}</strong>
                <span>{m.turmas?.cursos?.nome} - {m.turmas?.nome}</span>
                <small>Status: {m.status} | Matrícula: {m.data_matricula} | Renovação: {m.data_renovacao || '-'}</small>
                <div className="actions">
                  <button className="small" onClick={() => renovarMatricula(m.id)}>Renovar</button>
                  <button className="small danger" onClick={() => cancelarMatricula(m.id)}>Cancelar</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {aba === 'relatorios' && (
        <section className="card">
          <h2>Relatórios simples</h2>
          <div className="grid cards">
            <div className="mini"><strong>Ativas</strong><span>{relatorioPorStatus.ativa || 0}</span></div>
            <div className="mini"><strong>Renovadas</strong><span>{relatorioPorStatus.renovada || 0}</span></div>
            <div className="mini"><strong>Canceladas</strong><span>{relatorioPorStatus.cancelada || 0}</span></div>
          </div>
          <h3>Alunos por curso/turma</h3>
          <table>
            <thead><tr><th>Aluno</th><th>Curso</th><th>Turma</th><th>Status</th></tr></thead>
            <tbody>
              {matriculas.map(m => (
                <tr key={m.id}>
                  <td>{m.alunos?.nome}</td>
                  <td>{m.turmas?.cursos?.nome}</td>
                  <td>{m.turmas?.nome}</td>
                  <td>{m.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
