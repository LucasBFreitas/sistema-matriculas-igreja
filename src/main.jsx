function fmtDataBR(v){if(!v)return '-';const [a,m,d]=String(v).slice(0,10).split('-');return d&&m&&a?`${d}/${m}/${a}`:v}
import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { supabase } from './supabaseClient'
import './styles.css'

const alunoVazio = { nome:'', data_nascimento:'', sexo:'', cpf:'', rg:'', telefone:'', cep:'', logradouro:'', numero:'', complemento:'', bairro:'', cidade:'', zona:'', possui_deficiencia:'Não', qual_deficiencia:'', observacoes:'', responsavel_nome:'', responsavel_cpf:'', responsavel_telefone:'', responsavel_email:'', responsavel_endereco:'' }
const professorVazio = { nome:'', cpf:'', telefone:'', email:'' }
const cursoVazio = { nome:'', descricao:'' }
const turmaVazia = { curso_id:'', professor_id:'', nome:'', dias_horarios:'', vagas:20, periodo:'', data_inicio_semestre:'', data_fim_semestre:'' }
const periodoLetivoVazio = { nome:'', data_inicio:'', data_fim:'', observacoes:'', ativo:true }
const fmtTel = v => { const n=(v||'').replace(/\D/g,'').slice(0,11); if(n.length<=2)return n; if(n.length<=7)return `(${n.slice(0,2)}) ${n.slice(2)}`; return `(${n.slice(0,2)}) ${n.slice(2,7)}-${n.slice(7)}` }
const fmtCPF = v => { const n=(v||'').replace(/\D/g,'').slice(0,11); return n.length<=9 ? n : `${n.slice(0,9)}-${n.slice(9)}` }
const normalizarTexto = v => (v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase()
function definirZonaPorBairroCidade(bairro, cidade){
 const b = normalizarTexto(bairro)
 const c = (cidade||'').trim()
 const zonas = {
  'Zona Sul':['lagoa nova','ponta negra','capim macio','candelaria','nova descoberta','neopolis','pitimbu'],
  'Zona Leste':['petropolis','tirol','alecrim','ribeira','praia do meio','areia preta','cidade alta','barro vermelho','lagoa seca','mae luiza','rocas','santos reis'],
  'Zona Norte':['nossa senhora da apresentacao','lagoa azul','potengi','igapo','pajucara','redinha','salinas'],
  'Zona Oeste':['planalto','felipe camarao','cidade da esperanca','dix-sept rosado','bom pastor','quintas','nossa senhora de nazare','cidade nova','nordeste','guarapes']
 }
 for (const [zona,bairros] of Object.entries(zonas)){ if (bairros.includes(b)) return zona }
 return c
}

function App(){
 const [session,setSession]=useState(null),[email,setEmail]=useState(''),[senha,setSenha]=useState(''),[erro,setErro]=useState(''),[msg,setMsg]=useState(''),[aba,setAba]=useState('painel'),[loading,setLoading]=useState(false)
 const [alunos,setAlunos]=useState([]),[cursos,setCursos]=useState([]),[turmas,setTurmas]=useState([]),[professores,setProfessores]=useState([]),[matriculas,setMatriculas]=useState([]),[periodosLetivos,setPeriodosLetivos]=useState([]),[presencas,setPresencas]=useState([]),[usuarios,setUsuarios]=useState([]),[perfilUsuario,setPerfilUsuario]=useState('administrador')
 const [alunoForm,setAlunoForm]=useState(alunoVazio),[alunoEditId,setAlunoEditId]=useState(null),[profForm,setProfForm]=useState(professorVazio),[profEditId,setProfEditId]=useState(null),[cursoForm,setCursoForm]=useState(cursoVazio),[cursoEditId,setCursoEditId]=useState(null),[turmaForm,setTurmaForm]=useState(turmaVazia),[turmaEditId,setTurmaEditId]=useState(null),[matriculaForm,setMatriculaForm]=useState({aluno_id:'',turma_id:'',periodo_letivo_id:'',observacoes:''}),[chamadaForm,setChamadaForm]=useState({turma_id:'',periodo_letivo_id:'',data:new Date().toISOString().slice(0,10)}),[chamada,setChamada]=useState({}),[editandoChamada,setEditandoChamada]=useState(false),[renovacaoModal,setRenovacaoModal]=useState(null),[renovacaoForm,setRenovacaoForm]=useState({periodo_letivo_id:'',manter_turma:true,turma_id:''}),[periodoForm,setPeriodoForm]=useState(periodoLetivoVazio),[periodoEditId,setPeriodoEditId]=useState(null)
 const [buscaAluno,setBuscaAluno]=useState(''),[filtroAluno,setFiltroAluno]=useState('todos'),[buscaInscricao,setBuscaInscricao]=useState(''),[relatorioTurma,setRelatorioTurma]=useState('matriculados'),[modalRelatorio,setModalRelatorio]=useState(false),[usuarioForm,setUsuarioForm]=useState({email:'',perfil:'professor',professor_id:''})
 useEffect(()=>{supabase.auth.getSession().then(({data})=>setSession(data.session)); const {data:l}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s)); return()=>l.subscription.unsubscribe()},[])
 useEffect(()=>{if(session) carregarDados()},[session])
 useEffect(()=>{if(session) carregarPerfisAcesso()},[session])
 async function carregarPerfisAcesso(){
  try{
   const {data,error}=await supabase.from('usuarios_perfis').select('*, professores(nome)').order('email')
   if(error){setPerfilUsuario('administrador');setUsuarios([]);return}
   setUsuarios(data||[])
   const atual=(data||[]).find(u=>u.email?.toLowerCase()===session?.user?.email?.toLowerCase())
   setPerfilUsuario(atual?.perfil||'administrador')
  }catch{
   setPerfilUsuario('administrador')
   setUsuarios([])
  }
 }
 useEffect(()=>{if(!msg&&!erro)return;const toastAutoHide=setTimeout(()=>{setMsg('');setErro('')},3500);return()=>clearTimeout(toastAutoHide)},[msg,erro]);
 async function login(e){e.preventDefault();setErro('');const {error}=await supabase.auth.signInWithPassword({email,password:senha});if(error)setErro('E-mail ou senha inválidos.')}
 async function sair(){await supabase.auth.signOut()}
 async function carregarDados(){setLoading(true);const [al,cur,tur,prof,mat,per,pre]=await Promise.all([supabase.from('alunos').select('*, responsaveis(nome, cpf, telefone, email, endereco)').order('created_at',{ascending:false}),supabase.from('cursos').select('*').order('nome'),supabase.from('turmas').select('*, cursos(nome), professores(nome)').order('created_at',{ascending:false}),supabase.from('professores').select('*').order('nome'),supabase.from('matriculas').select('*, alunos(nome, ativo, excluido), turmas(nome, cursos(nome), professores(nome)), periodos_letivos(nome, data_inicio, data_fim)').order('created_at',{ascending:false}),supabase.from('periodos_letivos').select('*').order('nome',{ascending:false}),supabase.from('presencas').select('*')]); if(al.error||cur.error||tur.error||prof.error||mat.error||per.error||pre.error)setErro(al.error?.message||cur.error?.message||tur.error?.message||prof.error?.message||mat.error?.message||per.error?.message||pre.error?.message); else{setAlunos(al.data||[]);setCursos(cur.data||[]);setTurmas(tur.data||[]);setProfessores(prof.data||[]);setMatriculas(mat.data||[]);setPeriodosLetivos(per.data||[]);setPresencas(pre.data||[])} setLoading(false)}
 async function atualizar(t){await carregarDados();setMsg(t);setErro('')}
 function falhar(t){setErro(t);setMsg('')}
 function limparAluno(){setAlunoForm(alunoVazio);setAlunoEditId(null)}; function limparProfessor(){setProfForm(professorVazio);setProfEditId(null)}; function limparCurso(){setCursoForm(cursoVazio);setCursoEditId(null)}; function limparTurma(){setTurmaForm(turmaVazia);setTurmaEditId(null)}; function limparPeriodo(){setPeriodoForm(periodoLetivoVazio);setPeriodoEditId(null)}
 async function buscarCep(v){setAlunoForm(p=>({...p,cep:v}));const cep=v.replace(/\D/g,'');if(cep.length!==8)return;try{const r=await fetch(`https://viacep.com.br/ws/${cep}/json/`);const d=await r.json();if(d.erro)return falhar('CEP não encontrado.');setAlunoForm(p=>({...p,cep,logradouro:d.logradouro||'',bairro:d.bairro||'',cidade:d.localidade||'',zona:definirZonaPorBairroCidade(d.bairro||'',d.localidade||'')}))}catch{falhar('Não foi possível consultar o CEP agora.')}}
 async function salvarAluno(e){e.preventDefault();setErro('');let responsavel_id=null;const atual=alunos.find(a=>a.id===alunoEditId); if(alunoForm.responsavel_nome.trim()){const rp={nome:alunoForm.responsavel_nome,cpf:alunoForm.responsavel_cpf,telefone:alunoForm.responsavel_telefone,email:alunoForm.responsavel_email,endereco:alunoForm.responsavel_endereco}; if(alunoEditId&&atual?.responsavel_id){const {error}=await supabase.from('responsaveis').update(rp).eq('id',atual.responsavel_id); if(error)return falhar(error.message);responsavel_id=atual.responsavel_id}else{const {data,error}=await supabase.from('responsaveis').insert(rp).select().single(); if(error)return falhar(error.message);responsavel_id=data.id}}
 const payload={nome:alunoForm.nome,data_nascimento:alunoForm.data_nascimento||null,sexo:alunoForm.sexo,possui_deficiencia:alunoForm.possui_deficiencia,qual_deficiencia:alunoForm.possui_deficiencia==='Sim'?alunoForm.qual_deficiencia:'',cpf:alunoForm.cpf,rg:alunoForm.rg,telefone:alunoForm.telefone,cep:alunoForm.cep,logradouro:alunoForm.logradouro,numero:alunoForm.numero,complemento:alunoForm.complemento,bairro:alunoForm.bairro,cidade:alunoForm.cidade,zona:alunoForm.zona||definirZonaPorBairroCidade(alunoForm.bairro,alunoForm.cidade),endereco:[alunoForm.logradouro,alunoForm.numero,alunoForm.bairro,alunoForm.cidade].filter(Boolean).join(', '),observacoes:alunoForm.observacoes,responsavel_id}
 if(alunoEditId){const {error}=await supabase.from('alunos').update(payload).eq('id',alunoEditId).select().single(); if(error)return falhar(error.message); limparAluno(); await atualizar('Aluno atualizado.')} else {const {error}=await supabase.from('alunos').insert({...payload,ativo:true,excluido:false}).select().single(); if(error)return falhar(error.message); limparAluno(); await atualizar('Aluno cadastrado.')}}
 function editarAluno(a){setAlunoEditId(a.id);setAlunoForm({nome:a.nome||'',data_nascimento:a.data_nascimento||'',sexo:a.sexo||'',possui_deficiencia:a.possui_deficiencia||'Não',qual_deficiencia:a.qual_deficiencia||'',cpf:a.cpf||'',rg:a.rg||'',telefone:a.telefone||'',cep:a.cep||'',logradouro:a.logradouro||'',numero:a.numero||'',complemento:a.complemento||'',bairro:a.bairro||'',cidade:a.cidade||'',zona:a.zona||definirZonaPorBairroCidade(a.bairro||'',a.cidade||''),observacoes:a.observacoes||'',responsavel_nome:a.responsaveis?.nome||'',responsavel_cpf:a.responsaveis?.cpf||'',responsavel_telefone:a.responsaveis?.telefone||'',responsavel_email:a.responsaveis?.email||'',responsavel_endereco:a.responsaveis?.endereco||''});window.scrollTo({top:0,behavior:'smooth'})}
 async function statusAluno(id,ativo){if(!confirm(ativo?'Ativar este aluno?':'Inativar este aluno?'))return;const {error}=await supabase.from('alunos').update({ativo,excluido:false}).eq('id',id);if(error)return falhar(error.message);await atualizar(ativo?'Aluno ativado.':'Aluno inativado.')}
 async function excluirAluno(id){if(!confirm('Marcar este aluno como excluído?'))return;const {error}=await supabase.from('alunos').update({excluido:true,ativo:false}).eq('id',id);if(error)return falhar(error.message);await atualizar('Aluno marcado como excluído.')}
 async function salvarProfessor(e){e.preventDefault();if(!isAdmin)return falhar('Acesso restrito ao administrador.');const op=profEditId?supabase.from('professores').update(profForm).eq('id',profEditId).select().single():supabase.from('professores').insert({...profForm,ativo:true}).select().single();const {error}=await op;if(error)return falhar(error.message);limparProfessor();await atualizar(profEditId?'Professor atualizado.':'Professor cadastrado.')}
 async function excluirProfessor(id){if(!isAdmin)return falhar('Acesso restrito ao administrador.');if(!confirm('Excluir professor?'))return;const {error}=await supabase.from('professores').delete().eq('id',id);if(error)return falhar(error.message);await atualizar('Professor excluído.')}
 async function salvarCurso(e){e.preventDefault();if(!isAdmin)return falhar('Acesso restrito ao administrador.');const op=cursoEditId?supabase.from('cursos').update(cursoForm).eq('id',cursoEditId).select().single():supabase.from('cursos').insert({...cursoForm,ativo:true}).select().single();const {error}=await op;if(error)return falhar(error.message);limparCurso();await atualizar(cursoEditId?'Curso atualizado.':'Curso cadastrado.')}
 async function excluirCurso(id){if(!isAdmin)return falhar('Acesso restrito ao administrador.');if(!confirm('Excluir curso?'))return;const {error}=await supabase.from('cursos').delete().eq('id',id);if(error)return falhar('Não foi possível excluir curso com dados vinculados.');await atualizar('Curso excluído.')}
 async function salvarTurma(e){e.preventDefault();const p={curso_id:turmaForm.curso_id,professor_id:turmaForm.professor_id||null,nome:turmaForm.nome,dias_horarios:turmaForm.dias_horarios,vagas:Number(turmaForm.vagas||0),periodo:turmaForm.periodo,data_inicio_semestre:turmaForm.data_inicio_semestre||null,data_fim_semestre:turmaForm.data_fim_semestre||null};const op=turmaEditId?supabase.from('turmas').update(p).eq('id',turmaEditId).select().single():supabase.from('turmas').insert({...p,ativo:true}).select().single();const {error}=await op;if(error)return falhar(error.message);limparTurma();await atualizar(turmaEditId?'Turma atualizada.':'Turma cadastrada.')}
 async function excluirTurma(id){if(!confirm('Excluir turma?'))return;const {error}=await supabase.from('turmas').delete().eq('id',id);if(error)return falhar('Não foi possível excluir turma com matrículas vinculadas.');await atualizar('Turma excluída.')}
 async function salvarPeriodo(e){e.preventDefault();const payload={nome:periodoForm.nome,data_inicio:periodoForm.data_inicio||null,data_fim:periodoForm.data_fim||null,observacoes:periodoForm.observacoes,ativo:periodoForm.ativo!==false};const op=periodoEditId?supabase.from('periodos_letivos').update(payload).eq('id',periodoEditId).select().single():supabase.from('periodos_letivos').insert(payload).select().single();const {error}=await op;if(error)return falhar(error.message);limparPeriodo();await atualizar(periodoEditId?'Período letivo atualizado.':'Período letivo cadastrado.')}
 async function excluirPeriodo(id){if(!confirm('Excluir período letivo?'))return;const {error}=await supabase.from('periodos_letivos').delete().eq('id',id);if(error)return falhar('Não foi possível excluir período com matrículas vinculadas.');await atualizar('Período letivo excluído.')}
 async function salvarMatricula(e){e.preventDefault();const alunoSelecionado=alunos.find(a=>a.id===matriculaForm.aluno_id);if(!alunoSelecionado)return falhar('Selecione um aluno.');if(alunoSelecionado.ativo===false||alunoSelecionado.excluido)return falhar('Este aluno está inativo ou excluído. Ative o cadastro antes de matricular.');const turma=turmas.find(t=>t.id===matriculaForm.turma_id);if(!matriculaForm.periodo_letivo_id)return falhar('Selecione o período letivo da inscrição.');if(turmaLotada(turma,matriculaForm.periodo_letivo_id))return falhar('Essa turma já atingiu o limite de vagas para este período letivo.');const {error}=await supabase.from('matriculas').insert({...matriculaForm,status:'ativa'});if(error)return falhar(error.message);setMatriculaForm({aluno_id:'',turma_id:'',periodo_letivo_id:'',observacoes:''});await atualizar('Inscrição cadastrada.')}
 function abrirRenovacao(m){
  const proximoPeriodo=periodosLetivos[0]?.id||''
  setRenovacaoModal(m)
  setRenovacaoForm({periodo_letivo_id:proximoPeriodo,manter_turma:true,turma_id:m.turma_id||''})
}
function fecharRenovacao(){setRenovacaoModal(null);setRenovacaoForm({periodo_letivo_id:'',manter_turma:true,turma_id:''})}
async function confirmarRenovacao(e){
  e.preventDefault()
  if(!renovacaoModal)return
  const alunoRenovacao=alunos.find(a=>a.id===renovacaoModal.aluno_id)
  if(alunoRenovacao&&(alunoRenovacao.ativo===false||alunoRenovacao.excluido))return falhar('O cadastro deste aluno está inativo ou excluído. Ative o aluno antes de renovar ou reativar a matrícula.')
  if(!renovacaoForm.periodo_letivo_id)return falhar('Selecione o período letivo.')
  const turmaId=renovacaoForm.manter_turma?renovacaoModal.turma_id:renovacaoForm.turma_id
  if(!turmaId)return falhar('Selecione a turma.')
  const turma=turmas.find(t=>t.id===turmaId)
  if(turmaLotada(turma,renovacaoForm.periodo_letivo_id))return falhar('Essa turma já atingiu o limite de vagas para este período letivo.')
  const {error}=await supabase.from('matriculas').update({
    turma_id:turmaId,
    periodo_letivo_id:renovacaoForm.periodo_letivo_id,
    status:'renovada',
    data_renovacao:new Date().toISOString().slice(0,10)
  }).eq('id',renovacaoModal.id)
  if(error)return falhar(error.message)
  fecharRenovacao()
  await atualizar(renovacaoModal.status==='cancelada'?'Inscrição reativada.':'Inscrição renovada.')
}
 async function cancelarMatricula(id){if(!confirm('Cancelar esta inscrição?'))return;const {error}=await supabase.from('matriculas').update({status:'cancelada'}).eq('id',id);if(error)return falhar(error.message);await atualizar('Inscrição cancelada.')}
 function statusDoAluno(a){if(a.excluido)return 'Excluído';if(a.ativo===false)return 'Inativo';return matriculas.some(m=>m.aluno_id===a.id&&m.status!=='cancelada')?'Matriculado':'Sem matrícula'}
 function clsStatus(s){return 'status '+(s==='Matriculado'?'matriculado':s==='Sem matrícula'?'sem-matricula':s==='Inativo'?'inativo':'excluido')}
 function vagasOcupadas(turmaId,periodoId=null){return matriculas.filter(m=>m.turma_id===turmaId&&m.status!=='cancelada'&&(!periodoId||m.periodo_letivo_id===periodoId)).length}
 function vagasDisponiveis(turma,periodoId=null){const total=Number(turma?.vagas||0);const ocupadas=vagasOcupadas(turma?.id,periodoId);return Math.max(total-ocupadas,0)}
 function turmaLotada(turma,periodoId=null){return Number(turma?.vagas||0)>0&&vagasDisponiveis(turma,periodoId)<=0}
 const alunosAtivos=alunos.filter(a=>a.ativo!==false&&!a.excluido)
 const alunosElegiveisMatricula=alunos.filter(a=>a.ativo!==false&&!a.excluido), alunosFiltrados=alunos.filter(a=>{const txt=`${a.nome||''} ${a.cpf||''} ${a.telefone||''}`.toLowerCase();const bate=txt.includes(buscaAluno.toLowerCase());const st=statusDoAluno(a);if(filtroAluno==='matriculados')return bate&&st==='Matriculado';if(filtroAluno==='nao')return bate&&st==='Sem matrícula';if(filtroAluno==='inativos')return bate&&st==='Inativo';if(filtroAluno==='excluidos')return bate&&st==='Excluído';return bate})


 const listasPresenca=Object.values(presencas.reduce((acc,p)=>{
  const key=`${p.turma_id}|${p.periodo_letivo_id||''}|${p.data_chamada}`
  if(!acc[key])acc[key]={key,turma_id:p.turma_id,periodo_letivo_id:p.periodo_letivo_id,data_chamada:p.data_chamada,total:0,presentes:0,faltas:0}
  acc[key].total+=1
  if(p.status==='presente')acc[key].presentes+=1
  if(p.status==='faltou')acc[key].faltas+=1
  return acc
 },{})).sort((a,b)=>String(b.data_chamada).localeCompare(String(a.data_chamada)))
 function nomeTurmaPresenca(lista){const t=turmas.find(x=>x.id===lista.turma_id);return t?`${t.cursos?.nome||''} - ${t.nome||''}`:'Turma não encontrada'}
 function nomePeriodoPresenca(lista){return periodosLetivos.find(p=>p.id===lista.periodo_letivo_id)?.nome||'-'}
 function abrirListaPresenca(lista){
  const regs=presencas.filter(p=>p.turma_id===lista.turma_id&&p.periodo_letivo_id===lista.periodo_letivo_id&&p.data_chamada===lista.data_chamada)
  const mapa={}
  regs.forEach(p=>{mapa[p.matricula_id]=p.status})
  setChamadaForm({turma_id:lista.turma_id,periodo_letivo_id:lista.periodo_letivo_id||'',data:lista.data_chamada})
  setChamada(mapa)
  setEditandoChamada(true)
  setAba('presencas')
 }
 async function excluirListaPresenca(lista){
  if(!confirm('Excluir esta lista de presença?'))return
  const {error}=await supabase.from('presencas').delete().eq('turma_id',lista.turma_id).eq('periodo_letivo_id',lista.periodo_letivo_id).eq('data_chamada',lista.data_chamada)
  if(error)return falhar(error.message)
  setChamada({})
  setEditandoChamada(false)
  await atualizar('Lista de presença excluída.')
 }
 const alunosChamada=matriculas.filter(m=>m.status!=='cancelada'&&m.alunos&&m.turma_id===chamadaForm.turma_id&&String(m.periodo_letivo_id||'')===String(chamadaForm.periodo_letivo_id||'')).sort((a,b)=>(a.alunos?.nome||'').localeCompare(b.alunos?.nome||''))
 function marcarPresenca(matriculaId,status){setChamada({...chamada,[matriculaId]:status})}
 function totalPresencasAluno(alunoId){return presencas.filter(p=>p.aluno_id===alunoId&&p.status==='presente').length}
 async function salvarChamada(e){
  e.preventDefault()
  if(!chamadaForm.turma_id||!chamadaForm.periodo_letivo_id||!chamadaForm.data)return falhar('Selecione turma, período e data da chamada.')
  if(alunosChamada.length===0)return falhar('Nenhum aluno encontrado para esta turma e período.')
  const registros=alunosChamada.map(m=>({
    aluno_id:m.aluno_id,
    matricula_id:m.id,
    turma_id:m.turma_id,
    periodo_letivo_id:m.periodo_letivo_id,
    data_chamada:chamadaForm.data,
    status:chamada[m.id]||'faltou'
  }))
  const {error}=await supabase.from('presencas').upsert(registros,{onConflict:'matricula_id,data_chamada'})
  if(error)return falhar(error.message)
  setChamada({})
  setEditandoChamada(false)
  await atualizar(editandoChamada?'Lista de presença atualizada.':'Lista de presença salva.')
 }
 const inscricoesFiltradas=matriculas.filter(m=>{
  const q=buscaInscricao.toLowerCase().trim()
  if(!q)return true
  const texto=`${m.alunos?.nome||''} ${m.turmas?.nome||''} ${m.turmas?.cursos?.nome||''} ${m.turmas?.professores?.nome||''} ${m.periodos_letivos?.nome||''} ${m.status||''}`.toLowerCase()
  return texto.includes(q)
})
 const matriculasValidas=matriculas.filter(m=>m.status!=='cancelada'&&m.alunos&&!m.alunos.excluido&&m.alunos.ativo!==false)
 function matriculaAtivaDoAluno(alunoId){return matriculasValidas.find(m=>m.aluno_id===alunoId)}
 function linhaRelatorioAluno(a){
  const m=matriculaAtivaDoAluno(a.id)
  return {id:a.id,aluno:a.nome||'-',turma:m?`${m.turmas?.cursos?.nome||''} - ${m.turmas?.nome||''}`:'-',periodo:m?.periodos_letivos?.nome||'-',professor:m?.turmas?.professores?.nome||'-',presencas:totalPresencasAluno(a.id)}
 }
 const relatorio=useMemo(()=>{
  if(relatorioTurma.startsWith('turma:')){
    const turmaId=relatorioTurma.replace('turma:','')
    return matriculasValidas.filter(m=>m.turma_id===turmaId).map(m=>({id:m.id,aluno:m.alunos?.nome||'-',turma:`${m.turmas?.cursos?.nome||''} - ${m.turmas?.nome||''}`,periodo:m.periodos_letivos?.nome||'-',professor:m.turmas?.professores?.nome||'-',presencas:totalPresencasAluno(m.aluno_id)}))
  }
  if(relatorioTurma==='ativos')return alunos.filter(a=>a.ativo!==false&&!a.excluido).map(linhaRelatorioAluno)
  if(relatorioTurma==='sem_matricula')return alunos.filter(a=>a.ativo!==false&&!a.excluido&&!matriculasValidas.some(m=>m.aluno_id===a.id)).map(linhaRelatorioAluno)
  if(relatorioTurma==='inativos')return alunos.filter(a=>a.ativo===false&&!a.excluido).map(linhaRelatorioAluno)
  if(relatorioTurma==='excluidos')return alunos.filter(a=>a.excluido).map(linhaRelatorioAluno)
  return matriculasValidas.map(m=>({id:m.id,aluno:m.alunos?.nome||'-',turma:`${m.turmas?.cursos?.nome||''} - ${m.turmas?.nome||''}`,periodo:m.periodos_letivos?.nome||'-',professor:m.turmas?.professores?.nome||'-',presencas:totalPresencasAluno(m.aluno_id)}))
 },[relatorioTurma,alunos,matriculas,turmas])
 function imprimirRelatorio(tipo='1'){
  setModalRelatorio(false)
  const html = document.getElementById('relatorio-impressao')?.innerHTML || ''
  const agora = new Date().toLocaleString('pt-BR')
  const titulo = tipo === '2' ? 'Relatório Institucional de Matrículas' : 'Relatório Simplificado de Alunos'
  const subtitulo = tipo === '2' ? 'Documento oficial do Projeto Viva Esperança' : 'Resumo de alunos por turma'
  const assinatura = tipo === '2' ? '<div class="assinatura">____________________________________<br/>Coordenação Projeto Viva Esperança</div>' : ''
  const resumo = tipo === '2' ? `<div class="resumo"><strong>Data de emissão:</strong> ${agora}</div>` : `<div class="resumo"><strong>Emitido em:</strong> ${agora}</div>`
  const w = window.open('', '_blank')
  w.document.write(`<html><head><title>${titulo}</title><style>
    body{font-family:Arial,sans-serif;padding:30px;color:#1f2937}
    .cab{display:flex;align-items:center;gap:20px;border-bottom:3px solid #3a9c41;padding-bottom:15px;margin-bottom:20px}
    .cab img{width:80px;height:80px;object-fit:contain}
    .titulo{font-size:26px;font-weight:bold;color:#1f2937}
    .subtitulo{font-size:14px;color:#4b5563;margin-top:4px}
    .resumo{background:#f0fdf4;border:1px solid #bbf7d0;padding:12px;border-radius:10px;margin:15px 0}
    table{width:100%;border-collapse:collapse;margin-top:18px}
    th{background:#3a9c41;color:#fff}
    th,td{border:1px solid #ddd;padding:10px;text-align:left}
    tr:nth-child(even){background:#f8f8f8}
    .assinatura{margin-top:60px;text-align:center;color:#374151}
  </style></head><body>
    <div class="cab"><img src="/logo-viva-esperanca.png"><div><div class="titulo">${titulo}</div><div class="subtitulo">${subtitulo}</div></div></div>
    ${resumo}
    ${html}
    ${assinatura}
  </body></html>`)
  w.document.close()
  w.print()
}
 const turmasAtivas=turmas.length
 const matriculasAtivas=matriculas.filter(m=>m.status!=='cancelada'&&m.alunos&&!m.alunos.excluido&&m.alunos.ativo!==false).length
 const vagasTotais=turmas.reduce((acc,t)=>acc+Number(t.vagas||0),0)
 const vagasOcupadasTotal=turmas.reduce((acc,t)=>acc+vagasOcupadas(t.id),0)
 const vagasDisponiveisTotal=Math.max(vagasTotais-vagasOcupadasTotal,0)
 const ocupacaoGeral=vagasTotais?Math.round((vagasOcupadasTotal/vagasTotais)*100):0
 const turmasLotadas=turmas.filter(t=>turmaLotada(t)).length
 const turmasResumo=turmas.map(t=>{
  const total=Number(t.vagas||0)
  const ocupadas=vagasOcupadas(t.id)
  const disponiveis=Math.max(total-ocupadas,0)
  const percentual=total?Math.min(100,Math.round((ocupadas/total)*100)):0
  return {...t,total,ocupadas,disponiveis,percentual}
 }).sort((a,b)=>b.percentual-a.percentual)
 const contagem=useMemo(()=>({ativos:alunosAtivos.length,matriculados:alunos.filter(a=>statusDoAluno(a)==='Matriculado').length,inativos:alunos.filter(a=>statusDoAluno(a)==='Inativo').length,excluidos:alunos.filter(a=>statusDoAluno(a)==='Excluído').length}),[alunos,matriculas])
  const isAdmin=perfilUsuario==='administrador'
 const isCoordenador=perfilUsuario==='coordenador'||isAdmin

 async function salvarUsuarioPerfil(e){
  e.preventDefault()
  const emailPerfil=usuarioForm.email.trim().toLowerCase()
  if(!emailPerfil)return falhar('Informe o e-mail do usuário.')
  const payload={email:emailPerfil,perfil:usuarioForm.perfil,professor_id:usuarioForm.professor_id||null}
  const {error}=await supabase.from('usuarios_perfis').upsert(payload,{onConflict:'email'})
  if(error)return falhar(error.message)
  setUsuarioForm({email:'',perfil:'professor',professor_id:''})
  await carregarPerfisAcesso()
  setMsg('Perfil de acesso salvo.')
 }

 async function excluirUsuarioPerfil(email){
  if(!confirm('Remover perfil de acesso?'))return
  const {error}=await supabase.from('usuarios_perfis').delete().eq('email',email)
  if(error)return falhar(error.message)
  await carregarPerfisAcesso()
  setMsg('Perfil removido.')
 }

if(!session)return <main className="login-page premium-login-page"><section className="login-hero-panel"><div className="login-hero-content"><img src="/logo-viva-esperanca.png" alt="Logo Viva Esperança"/><h2>Projeto Viva Esperança</h2><p>Gestão simples, acolhedora e organizada para matrículas do projeto social.</p></div></section><form className="card login-card premium-login-card" onSubmit={login}><h1>Bem-vindo de volta</h1>
        <p>Acesse para gerenciar suas matrículas</p><input placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} type="email" required/><input placeholder="Senha" value={senha} onChange={e=>setSenha(e.target.value)} type="password" required/><button>Entrar</button></form></main>
 const abas=[['painel','🏠 Painel'],['alunos','🎓 Alunos'],['professores','👨‍🏫 Professores'],['cursos','📚 Cursos'],['periodos','🗓️ Períodos'],['turmas','🏫 Turmas'],['inscricoes','📝 Inscrições'],['presencas','✅ Presenças'],['relatorios','📊 Relatórios'],['acessos','🔐 Acessos']]
 return <main className="app-shell"><header className="app-header-fixed premium-header">
        <div className="brand-fixed">
          <img className="brand-logo-fixed" src="/logo-viva-esperanca.png" alt="Logo Viva Esperança" />
          <img className="brand-wordmark" src="/wordmark-viva-esperanca.png" alt="Viva Esperança" />
        </div>
        <div className="header-actions">
          <span className="admin-pill">{perfilUsuario==='administrador'?'Administrador':perfilUsuario==='coordenador'?'Coordenador':'Professor'}</span>
          <button className="logout-fixed" onClick={sair}>Sair</button>
        </div>
      </header><nav className="tabs">{abas.map(([id,n])=><button key={id} className={aba===id?'active':''} onClick={()=>setAba(id)}>{n}</button>)}</nav>{loading&&<p className="loading-premium">Atualizando dados...</p>}
 {(msg||erro)&&<div className="toast-container"><div className={erro?'toast error':'toast success'}>{erro||msg}</div></div>}{aba==='painel'&&<section className="dashboard-inteligente">
  <div className="dashboard-hero card">
    <div>
      <span className="dashboard-kicker">Visão gerencial</span>
      <h2>Dashboard Inteligente</h2>
      <p>Acompanhe matrículas, vagas e ocupação das turmas em tempo real.</p>
    </div>
    <div className="dashboard-score">
      <strong>{ocupacaoGeral}%</strong>
      <span>Ocupação geral</span>
    </div>
  </div>

  <div className="grid cards smart-cards">
    <div className="card stat-card"><span className="stat-icon">👨‍🎓</span><h2>{alunos.length}</h2><p>Alunos cadastrados</p></div>
    <div className="card stat-card"><span className="stat-icon">📝</span><h2>{matriculasAtivas}</h2><p>Matrículas ativas</p></div>
    <div className="card stat-card"><span className="stat-icon">🏫</span><h2>{turmasAtivas}</h2><p>Turmas cadastradas</p></div>
    <div className="card stat-card"><span className="stat-icon">✅</span><h2>{vagasDisponiveisTotal}</h2><p>Vagas disponíveis</p></div>
  </div>

  <div className="grid two dashboard-grid">
    <div className="card">
      <div className="form-title">
        <h2>Ocupação das turmas</h2>
        <span className="admin-pill">{turmasLotadas} lotadas</span>
      </div>
      {turmasResumo.length===0&&<p className="muted">Nenhuma turma cadastrada ainda.</p>}
      {turmasResumo.map(t=><div className="turma-progress" key={t.id}>
        <div className="turma-progress-head">
          <div>
            <strong>{t.cursos?.nome} - {t.nome}</strong>
            <small>Professor: {t.professores?.nome||'Não informado'}</small>
          </div>
          <span className={t.disponiveis===0&&t.total>0?'pill danger-pill':t.disponiveis<=3&&t.total>0?'pill warn-pill':'pill ok-pill'}>
            {t.total>0 ? `${t.disponiveis} vagas` : 'Sem limite'}
          </span>
        </div>
        <div className="progress-line">
          <div style={{width:`${t.percentual}%`}}></div>
        </div>
        <div className="turma-progress-foot">
          <span>{t.ocupadas}/{t.total||'∞'} ocupadas</span>
          <span>{t.percentual}%</span>
        </div>
      </div>)}
    </div>

    <div className="card management-panel">
      <h2>Indicadores de vagas</h2>
      <div className="indicator-row"><span>Vagas totais</span><strong>{vagasTotais}</strong></div>
      <div className="indicator-row"><span>Vagas ocupadas</span><strong>{vagasOcupadasTotal}</strong></div>
      <div className="indicator-row"><span>Vagas disponíveis</span><strong>{vagasDisponiveisTotal}</strong></div>
      <div className="indicator-row"><span>Turmas lotadas</span><strong>{turmasLotadas}</strong></div>
      <div className="mini-note">Use esta visão para acompanhar rapidamente onde ainda existem vagas e quais turmas exigem atenção da coordenação.</div>
    </div>
  </div>
</section>}
 {aba==='alunos'&&<section className="grid two"><form className="card form-grid" onSubmit={salvarAluno}><div className="form-title"><h2>{alunoEditId?'Editar aluno':'Novo aluno'}</h2>{alunoEditId&&<button type="button" className="secondary small" onClick={limparAluno}>Cancelar</button>}</div><div className="form-grid"><input placeholder="Nome do aluno" value={alunoForm.nome} onChange={e=>setAlunoForm({...alunoForm,nome:e.target.value})} required/><input type="date" value={alunoForm.data_nascimento} onChange={e=>setAlunoForm({...alunoForm,data_nascimento:e.target.value})}/><select value={alunoForm.sexo} onChange={e=>setAlunoForm({...alunoForm,sexo:e.target.value})}><option value="">Sexo</option><option value="Masculino">Masculino</option><option value="Feminino">Feminino</option></select><select value={alunoForm.possui_deficiencia} onChange={e=>setAlunoForm({...alunoForm,possui_deficiencia:e.target.value,qual_deficiencia:e.target.value==='Não'?'':alunoForm.qual_deficiencia})}><option value="Não">Possui deficiência? Não</option><option value="Sim">Possui deficiência? Sim</option></select><input placeholder="Qual deficiência?" value={alunoForm.qual_deficiencia} disabled={alunoForm.possui_deficiencia!=='Sim'} onChange={e=>setAlunoForm({...alunoForm,qual_deficiencia:e.target.value})}/><input placeholder="999.999.999-99" value={alunoForm.cpf} onChange={e=>setAlunoForm({...alunoForm,cpf:fmtCPF(e.target.value)})}/><input placeholder="RG" value={alunoForm.rg} onChange={e=>setAlunoForm({...alunoForm,rg:e.target.value})}/><input placeholder="(99) 99999-9999" value={alunoForm.telefone} onChange={e=>setAlunoForm({...alunoForm,telefone:fmtTel(e.target.value)})}/><input placeholder="00000-000" value={alunoForm.cep} onChange={e=>buscarCep(e.target.value)}/><input placeholder="Rua, Av..." value={alunoForm.logradouro} onChange={e=>setAlunoForm({...alunoForm,logradouro:e.target.value})}/><input placeholder="Nº" value={alunoForm.numero} onChange={e=>setAlunoForm({...alunoForm,numero:e.target.value})}/><input placeholder="Apto, Bloco..." value={alunoForm.complemento} onChange={e=>setAlunoForm({...alunoForm,complemento:e.target.value})}/><input placeholder="Bairro" value={alunoForm.bairro} onChange={e=>{const bairro=e.target.value;setAlunoForm({...alunoForm,bairro,zona:definirZonaPorBairroCidade(bairro,alunoForm.cidade)})}}/><input placeholder="Cidade" value={alunoForm.cidade} onChange={e=>{const cidade=e.target.value;setAlunoForm({...alunoForm,cidade,zona:definirZonaPorBairroCidade(alunoForm.bairro,cidade)})}}/><input placeholder="Zona" value={alunoForm.zona} readOnly title="Zona definida automaticamente pelo bairro"/></div><textarea placeholder="Observações" value={alunoForm.observacoes} onChange={e=>setAlunoForm({...alunoForm,observacoes:e.target.value})}/><h3>Responsável</h3><div className="form-grid"><input placeholder="Nome do responsável" value={alunoForm.responsavel_nome} onChange={e=>setAlunoForm({...alunoForm,responsavel_nome:e.target.value})}/><input placeholder="CPF responsável" value={alunoForm.responsavel_cpf} onChange={e=>setAlunoForm({...alunoForm,responsavel_cpf:fmtCPF(e.target.value)})}/><input placeholder="Telefone responsável" value={alunoForm.responsavel_telefone} onChange={e=>setAlunoForm({...alunoForm,responsavel_telefone:fmtTel(e.target.value)})}/><input placeholder="E-mail responsável" value={alunoForm.responsavel_email} onChange={e=>setAlunoForm({...alunoForm,responsavel_email:e.target.value})}/></div><button>{alunoEditId?'Salvar alterações':'Salvar aluno'}</button></form><div className="card"><h2>Alunos</h2><div className="toolbar"><input placeholder="Procurar" value={buscaAluno} onChange={e=>setBuscaAluno(e.target.value)}/><select value={filtroAluno} onChange={e=>setFiltroAluno(e.target.value)}><option value="todos">Todos</option><option value="matriculados">Matriculado</option><option value="nao">Sem matrícula</option><option value="inativos">Inativo</option><option value="excluidos">Excluído</option></select></div>{alunosFiltrados.map(a=>{const st=statusDoAluno(a);return <div className={a.excluido||a.ativo===false?'item inactive':'item'} key={a.id}><strong>{a.nome} <span className={clsStatus(st)}>{st}</span></strong><small>{a.telefone||'-'} | CPF: {a.cpf||'-'} | Sexo: {a.sexo||'-'}</small><small>{a.logradouro||'-'}, {a.numero||'-'} - {a.bairro||'-'} - {a.cidade||'-'} | Zona: {a.zona||definirZonaPorBairroCidade(a.bairro,a.cidade)||'-'}</small>{a.possui_deficiencia==='Sim'&&<small>Deficiência: {a.qual_deficiencia||'Não informada'}</small>}<div className="actions">
  {a.ativo===false||a.excluido
    ? <button className="small" onClick={()=>statusAluno(a.id,true)}>Ativar</button>
    : <>
        <button className="small" onClick={()=>editarAluno(a)}>Editar</button>
        <button className="small warning" onClick={()=>statusAluno(a.id,false)}>Inativar</button>
        <button className="small danger" onClick={()=>excluirAluno(a.id)}>Excluir</button>
      </>
  }
</div></div>})}</div></section>}
 {aba==='professores'&&<section className="grid two"><form className="card form-grid" onSubmit={salvarProfessor}><h2>{profEditId?'Editar professor':'Novo professor'}</h2><input placeholder="Nome" value={profForm.nome} onChange={e=>setProfForm({...profForm,nome:e.target.value})} required/><input placeholder="CPF" value={profForm.cpf} onChange={e=>setProfForm({...profForm,cpf:fmtCPF(e.target.value)})}/><input placeholder="Telefone" value={profForm.telefone} onChange={e=>setProfForm({...profForm,telefone:fmtTel(e.target.value)})}/><input placeholder="E-mail" value={profForm.email} onChange={e=>setProfForm({...profForm,email:e.target.value})}/><button>{profEditId?'Salvar professor':'Cadastrar professor'}</button>{profEditId&&<button type="button" className="secondary" onClick={limparProfessor}>Cancelar</button>}</form><div className="card"><h2>Professores</h2>{professores.map(p=><div className="item" key={p.id}><strong>{p.nome}</strong><small>{p.telefone||'-'} | {p.email||'-'}</small><div className="actions"><button className="small" onClick={()=>{setProfEditId(p.id);setProfForm({nome:p.nome||'',cpf:p.cpf||'',telefone:p.telefone||'',email:p.email||''})}}>Editar</button><button className="small danger" onClick={()=>excluirProfessor(p.id)}>Excluir</button></div></div>)}</div></section>}
 {aba==='cursos'&&<section className="grid two"><form className="card form-grid" onSubmit={salvarCurso}><h2>{cursoEditId?'Editar curso':'Novo curso'}</h2><input placeholder="Nome" value={cursoForm.nome} onChange={e=>setCursoForm({...cursoForm,nome:e.target.value})} required/><textarea placeholder="Descrição" value={cursoForm.descricao} onChange={e=>setCursoForm({...cursoForm,descricao:e.target.value})}/><button>{cursoEditId?'Salvar curso':'Cadastrar curso'}</button>{cursoEditId&&<button type="button" className="secondary" onClick={limparCurso}>Cancelar</button>}</form><div className="card"><h2>Cursos</h2>{cursos.map(c=><div className="item" key={c.id}><strong>{c.nome}</strong><small>{c.descricao}</small><div className="actions"><button className="small" onClick={()=>{setCursoEditId(c.id);setCursoForm({nome:c.nome||'',descricao:c.descricao||''})}}>Editar</button><button className="small danger" onClick={()=>excluirCurso(c.id)}>Excluir</button></div></div>)}</div></section>}
 {aba==='periodos'&&<section className="grid two"><form className="card form-grid" onSubmit={salvarPeriodo}><h2>{periodoEditId?'Editar período':'Novo período letivo'}</h2><input placeholder="Ex: 2026.1" value={periodoForm.nome} onChange={e=>setPeriodoForm({...periodoForm,nome:e.target.value})} required/><label className="field-label">Data de início</label><input type="date" value={periodoForm.data_inicio} onChange={e=>setPeriodoForm({...periodoForm,data_inicio:e.target.value})}/><label className="field-label">Data de término</label><input type="date" value={periodoForm.data_fim} onChange={e=>setPeriodoForm({...periodoForm,data_fim:e.target.value})}/><textarea placeholder="Observações do período" value={periodoForm.observacoes} onChange={e=>setPeriodoForm({...periodoForm,observacoes:e.target.value})}/><button>{periodoEditId?'Salvar período':'Cadastrar período'}</button>{periodoEditId&&<button type="button" className="secondary" onClick={limparPeriodo}>Cancelar</button>}</form><div className="card"><h2>Períodos letivos</h2>{periodosLetivos.map(p=><div className="item" key={p.id}><strong>{p.nome}</strong><small>Início: {p.data_inicio||'-'} | Término: {p.data_fim||'-'}</small><small>{p.observacoes||''}</small><div className="actions"><button className="small" onClick={()=>{setPeriodoEditId(p.id);setPeriodoForm({nome:p.nome||'',data_inicio:p.data_inicio||'',data_fim:p.data_fim||'',observacoes:p.observacoes||'',ativo:p.ativo!==false})}}>Editar</button><button className="small danger" onClick={()=>excluirPeriodo(p.id)}>Excluir</button></div></div>)}</div></section>}
 {aba==='turmas'&&<section className="grid two"><form className="card form-grid" onSubmit={salvarTurma}><h2>{turmaEditId?'Editar turma':'Nova turma'}</h2><select value={turmaForm.curso_id} onChange={e=>setTurmaForm({...turmaForm,curso_id:e.target.value})} required><option value="">Curso</option>{cursos.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</select><select value={turmaForm.professor_id} onChange={e=>setTurmaForm({...turmaForm,professor_id:e.target.value})}><option value="">Professor</option>{professores.map(p=><option key={p.id} value={p.id}>{p.nome}</option>)}</select><input placeholder="Nome da turma" value={turmaForm.nome} onChange={e=>setTurmaForm({...turmaForm,nome:e.target.value})} required/><input type="number" placeholder="Número total de vagas" value={turmaForm.vagas} onChange={e=>setTurmaForm({...turmaForm,vagas:e.target.value})}/><button>{turmaEditId?'Salvar turma':'Cadastrar turma'}</button>{turmaEditId&&<button type="button" className="secondary" onClick={limparTurma}>Cancelar</button>}</form><div className="card"><h2>Turmas</h2>{turmas.map(t=><div className="item" key={t.id}><strong>{t.cursos?.nome} - {t.nome}</strong><small>Professor: {t.professores?.nome||'Não informado'}</small><small>{t.dias_horarios||'-'} | Vagas totais: {t.vagas} | Ocupadas: {vagasOcupadas(t.id)} | Disponíveis: {vagasDisponiveis(t)}</small>{turmaLotada(t)&&<small className="lotada">Turma lotada</small>}<div className="actions"><button className="small" onClick={()=>{setTurmaEditId(t.id);setTurmaForm({curso_id:t.curso_id||'',professor_id:t.professor_id||'',nome:t.nome||'',dias_horarios:t.dias_horarios||'',vagas:t.vagas||0,periodo:t.periodo||'',periodo_aulas:t.periodo_aulas||'',periodo_ferias:t.periodo_ferias||'',periodo_recomeco:t.periodo_recomeco||'',periodo_encerramento:t.periodo_encerramento||''})}}>Editar</button><button className="small danger" onClick={()=>excluirTurma(t.id)}>Excluir</button></div></div>)}</div></section>}
 {aba==='inscricoes'&&<section className="grid two"><form className="card form-grid" onSubmit={salvarMatricula}><h2>Nova inscrição</h2><select value={matriculaForm.aluno_id} onChange={e=>setMatriculaForm({...matriculaForm,aluno_id:e.target.value})} required><option value="">Aluno</option>{alunosElegiveisMatricula.map(a=><option key={a.id} value={a.id}>{a.nome}</option>)}</select><select value={matriculaForm.periodo_letivo_id} onChange={e=>setMatriculaForm({...matriculaForm,periodo_letivo_id:e.target.value})} required><option value="">Período letivo</option>{periodosLetivos.map(p=><option key={p.id} value={p.id}>{p.nome}</option>)}</select><select value={matriculaForm.turma_id} onChange={e=>setMatriculaForm({...matriculaForm,turma_id:e.target.value})} required><option value="">Turma</option>{turmas.map(t=><option key={t.id} value={t.id} disabled={matriculaForm.periodo_letivo_id&&turmaLotada(t,matriculaForm.periodo_letivo_id)}>{t.cursos?.nome} - {t.nome} ({matriculaForm.periodo_letivo_id?vagasDisponiveis(t,matriculaForm.periodo_letivo_id):vagasDisponiveis(t)} vagas disponíveis)</option>)}</select><textarea placeholder="Observações" value={matriculaForm.observacoes} onChange={e=>setMatriculaForm({...matriculaForm,observacoes:e.target.value})}/><button>Inscrever</button></form><div className="card"><h2>Inscrições</h2><div className="search-row"><input placeholder="Procurar inscrição..." value={buscaInscricao} onChange={e=>setBuscaInscricao(e.target.value)}/></div>{inscricoesFiltradas.length===0&&<p className="muted">Nenhuma inscrição encontrada.</p>}{inscricoesFiltradas.map(m=><div className="item" key={m.id}><strong>{m.alunos?.nome}</strong><small>{m.turmas?.cursos?.nome} - {m.turmas?.nome} | Período: {m.periodos_letivos?.nome||'-'} | Professor: {m.turmas?.professores?.nome||'-'}</small><small>Status: {m.status === 'cancelada' ? 'Cancelada' : m.status}</small><div className="actions"><button className="small" onClick={()=>abrirRenovacao(m)}>{m.status==='cancelada'?'Reativar':'Renovar'}</button>{m.status!=='cancelada'&&<button className="small danger" onClick={()=>cancelarMatricula(m.id)}>Cancelar inscrição</button>}</div></div>)}</div></section>}
 {aba==='presencas'&&<section className="grid two"><form className="card form-grid" onSubmit={salvarChamada}><h2>Lista de presença</h2><select value={chamadaForm.periodo_letivo_id} onChange={e=>setChamadaForm({...chamadaForm,periodo_letivo_id:e.target.value})} required><option value="">Período letivo</option>{periodosLetivos.map(p=><option key={p.id} value={p.id}>{p.nome}</option>)}</select><select value={chamadaForm.turma_id} onChange={e=>setChamadaForm({...chamadaForm,turma_id:e.target.value})} required><option value="">Turma</option>{turmas.map(t=><option key={t.id} value={t.id}>{t.cursos?.nome} - {t.nome}</option>)}</select><label className="field-label">Data da chamada</label><input type="date" value={chamadaForm.data} onChange={e=>setChamadaForm({...chamadaForm,data:e.target.value})} required/><button>{editandoChamada?'Atualizar lista de presença':'Salvar lista de presença'}</button>{editandoChamada&&<button type="button" className="secondary" onClick={()=>{setEditandoChamada(false);setChamada({})}}>Cancelar edição</button>}</form><div className="card"><h2>Chamada</h2>{!chamadaForm.turma_id||!chamadaForm.periodo_letivo_id?<p className="muted">Selecione período e turma para carregar os alunos.</p>:alunosChamada.length===0?<p className="muted">Nenhum aluno matriculado nessa turma/período.</p>:alunosChamada.map(m=><div className="item chamada-item" key={m.id}><strong>{m.alunos?.nome}</strong><small>{m.turmas?.cursos?.nome} - {m.turmas?.nome} | Presenças: {totalPresencasAluno(m.aluno_id)}</small>{chamada[m.id]&&<span className={chamada[m.id]==='presente'?'status-chamada presente-status':'status-chamada faltou-status'}>{chamada[m.id]==='presente'?'Aluno marcado como PRESENTE':'Aluno marcado como FALTOU'}</span>}<div className="actions"><button type="button" className={chamada[m.id]==='presente'?'small present active selected-presente':'small present'} onClick={()=>marcarPresenca(m.id,'presente')}>{chamada[m.id]==='presente'?'✓ Presente':'Presente'}</button><button type="button" className={chamada[m.id]==='faltou'?'small danger active selected-faltou':'small danger'} onClick={()=>marcarPresenca(m.id,'faltou')}>{chamada[m.id]==='faltou'?'✕ Faltou':'Faltou'}</button></div></div>)}</div></section>}
 {aba==='presencas'&&<section className="card listas-presenca-card"><div className="form-title"><h2>Listas de presença salvas</h2><span className="admin-pill">{listasPresenca.length} listas</span></div>{listasPresenca.length===0?<p className="muted">Nenhuma lista de presença salva ainda.</p>:<div className="listas-presenca-grid">{listasPresenca.map(l=><div className="item lista-presenca-item" key={l.key}><div className="lista-presenca-top"><strong>{nomeTurmaPresenca(l)}</strong><span className="data-chamada-badge">{fmtDataBR(l.data_chamada)}</span></div><small>Período: {nomePeriodoPresenca(l)}</small><small>Total: {l.total} | Presentes: {l.presentes} | Faltas: {l.faltas}</small><div className="actions"><button className="small" onClick={()=>abrirListaPresenca(l)}>Abrir / Editar</button><button className="small danger" onClick={()=>excluirListaPresenca(l)}>Excluir lista</button></div></div>)}</div>}</section>} {aba==='acessos'&&<section className="grid two acessos-layout"><form className="card form-grid" onSubmit={salvarUsuarioPerfil}><h2>Novo acesso</h2><input placeholder="E-mail do usuário" value={usuarioForm.email} onChange={e=>setUsuarioForm({...usuarioForm,email:e.target.value})} required/><select value={usuarioForm.perfil} onChange={e=>setUsuarioForm({...usuarioForm,perfil:e.target.value})}><option value="professor">Professor</option><option value="coordenador">Coordenador</option><option value="administrador">Administrador</option></select>{usuarioForm.perfil==='professor'&&<select value={usuarioForm.professor_id} onChange={e=>setUsuarioForm({...usuarioForm,professor_id:e.target.value})}><option value="">Vincular professor</option>{professores.map(p=><option key={p.id} value={p.id}>{p.nome}</option>)}</select>}<button>Salvar acesso</button><p className="muted">Cadastre o e-mail do usuário e defina o perfil de acesso.</p></form><div className="card"><h2>Perfis de acesso</h2>{usuarios.length===0&&<p className="muted">Nenhum perfil cadastrado ainda.</p>}{usuarios.map(u=><div className="item" key={u.id||u.email}><strong>{u.email}</strong><small>Perfil: {u.perfil}</small>{u.professores?.nome&&<small>Professor vinculado: {u.professores.nome}</small>}<div className="actions"><button className="small danger" onClick={()=>excluirUsuarioPerfil(u.email)}>Remover</button></div></div>)}</div></section>} {aba==='relatorios'&&<section className="card"><div className="form-title"><h2>Relatórios</h2><button onClick={()=>setModalRelatorio(true)}>Imprimir relatório</button></div><select value={relatorioTurma} onChange={e=>setRelatorioTurma(e.target.value)}><option value="matriculados">Alunos matriculados</option><option value="ativos">Alunos cadastrados</option><option value="sem_matricula">Alunos sem matrícula</option><option value="inativos">Alunos inativos</option><option value="excluidos">Alunos excluídos</option>{turmas.map(t=><option key={t.id} value={`turma:${t.id}`}>{t.cursos?.nome} - {t.nome} ({vagasDisponiveis(t)} vagas disponíveis)</option>)}</select><div id="relatorio-impressao"><h1>Relatório de Alunos</h1><table><thead><tr><th>Aluno</th><th>Turma</th><th>Período</th><th>Professor</th><th>Presenças</th></tr></thead><tbody>{relatorio.map(r=><tr key={r.id}><td>{r.aluno}</td><td>{r.turma}</td><td>{r.periodo||'-'}</td><td>{r.professor}</td><td>{r.presencas||0}</td></tr>)}</tbody></table></div></section>}
 {renovacaoModal&&<div className="modal-backdrop">
  <form className="modal-card" onSubmit={confirmarRenovacao}>
    <h2>{renovacaoModal.status==='cancelada'?'Reativar inscrição':'Renovar inscrição'}</h2>
    <p className="modal-subtitle">{renovacaoModal.alunos?.nome||'Aluno'} — {renovacaoModal.turmas?.cursos?.nome||''} - {renovacaoModal.turmas?.nome||''}</p>
    <label className="field-label">Para qual período letivo?</label>
    <select value={renovacaoForm.periodo_letivo_id} onChange={e=>setRenovacaoForm({...renovacaoForm,periodo_letivo_id:e.target.value})} required>
      <option value="">Selecione o período</option>
      {periodosLetivos.map(p=><option key={p.id} value={p.id}>{p.nome}</option>)}
    </select>
    <label className="check-row">
      <input type="checkbox" checked={renovacaoForm.manter_turma} onChange={e=>setRenovacaoForm({...renovacaoForm,manter_turma:e.target.checked,turma_id:e.target.checked?renovacaoModal.turma_id:renovacaoForm.turma_id})}/>
      Manter o mesmo curso e turma
    </label>
    {!renovacaoForm.manter_turma&&<>
      <label className="field-label">Escolha a nova turma</label>
      <select value={renovacaoForm.turma_id} onChange={e=>setRenovacaoForm({...renovacaoForm,turma_id:e.target.value})} required>
        <option value="">Selecione a turma</option>
        {turmas.map(t=><option key={t.id} value={t.id} disabled={renovacaoForm.periodo_letivo_id&&turmaLotada(t,renovacaoForm.periodo_letivo_id)}>{t.cursos?.nome} - {t.nome} ({renovacaoForm.periodo_letivo_id?vagasDisponiveis(t,renovacaoForm.periodo_letivo_id):vagasDisponiveis(t)} vagas disponíveis)</option>)}
      </select>
    </>}
    <div className="modal-actions">
      <button type="button" className="secondary" onClick={fecharRenovacao}>Cancelar</button>
      <button>{renovacaoModal.status==='cancelada'?'Reativar':'Renovar'}</button>
    </div>
  </form>
</div>}{modalRelatorio&&<div className="modal-backdrop">
  <div className="modal-card relatorio-modal">
    <h2>Escolha o modelo do relatório</h2>
    <p className="modal-subtitle">Selecione como deseja imprimir este relatório.</p>

    <div className="relatorio-opcoes">
      <button type="button" className="relatorio-opcao" onClick={()=>imprimirRelatorio('1')}>
        <span className="relatorio-icone">📄</span>
        <strong>Relatório Simplificado</strong>
        <small>Modelo direto, com a estrutura básica da lista atual.</small>
      </button>

      <button type="button" className="relatorio-opcao destaque" onClick={()=>imprimirRelatorio('2')}>
        <span className="relatorio-icone">🏛️</span>
        <strong>Relatório Institucional</strong>
        <small>Modelo com cabeçalho, identidade visual e assinatura.</small>
      </button>
    </div>

    <div className="modal-actions">
      <button type="button" className="secondary" onClick={()=>setModalRelatorio(false)}>Cancelar</button>
    </div>
  </div>
</div>}</main>
}
createRoot(document.getElementById('root')).render(<App />)
