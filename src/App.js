import "./App.css";
import "./design.css";
// import 'animate.css';
import React, { useState } from "react";
import Context from "./pages/Context";
// páginas.
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Prontuario from "./pages/Prontuario";
import ProntuarioTodosPacientes from "./pages/ProntuarioTodosPacientes";
import Consultas from "./pages/Consultas";
import Usuarios from "./pages/Usuarios";
import Triagem from "./pages/Triagem";
import Painel from "./pages/Painel";
import Laboratorio from "./pages/Laboratorio";
import Agendamento from "./pages/Agendamento";
import Farmacia from "./pages/Farmacia";
import Almoxarifado from "./pages/Almoxarifado";
import Faturamento from "./pages/Faturamento";
import Resultados from "./pages/Resultados";
// componentes.
import Toast from "./components/Toast";
import Modal from "./components/Modal";
import DatePicker from "./components/DatePicker";

// router.
import {
  // BrowserRouter as Router, >> pode usar fora do githubPages.
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  var html = "https://lepton-server.up.railway.app/";
  var htmlnirvana = 'https://nirvana-api.up.railway.app/';

  // estados do context.
  const [toast, settoast] = useState({
    display: "none",
    mensagem: "",
    cor: "transparent",
  });
  const [dialogo, setdialogo] = useState({ id: 0, mensagem: "", funcao: null });

  const [viewdatepicker, setviewdatepicker] = useState(0);
  const [pickdate1, setpickdate1] = useState();
  const [pickdate2, setpickdate2] = useState();

  // DEVE SER CONFIGURADO PARA CADA CLIENTE.
  const [cliente, setcliente] = useState({
    id_cliente: 1,
    razao_social: "UPA - VENDA NOVA",
    cnes: "1234287",
    cnpj: "CNPJ: 1001/001",
    texto1: 'ENDEREÇO: RUA PADRE PEDRO PINTO, 175, VENDA NOVA - BH/MG',
    texto2: 'TELEFONE: (31) 3277-8909'
  });

  const [unidades, setunidades] = useState([]);
  const [hospital, sethospital] = useState([]);
  const [unidade, setunidade] = useState([]);
  const [usuario, setusuario] = useState({});
  const [usuarios, setusuarios] = useState([]); // lista todos os usuários cadastrados.
  const [dono_documento, setdono_documento] = useState({});

  const [pagina, setpagina] = useState(0);

  // configuração de tema e cards visíveis.
  const [settings, setsettings] = useState([]);
  const [tema, settema] = useState(1);
  const [carddiasinternacao, setcarddiasinternacao] = useState(1);
  const [cardalergias, setcardalergias] = useState(1);
  const [cardanamnese, setcardanamnese] = useState(1);
  const [cardevolucoes, setcardevolucoes] = useState(1);
  const [cardpropostas, setcardpropostas] = useState(1);
  const [cardprecaucoes, setcardprecaucoes] = useState(1);
  const [cardriscos, setcardriscos] = useState(1);
  const [cardalertas, setcardalertas] = useState(1);
  const [cardsinaisvitais, setcardsinaisvitais] = useState(1);
  const [cardbody, setcardbody] = useState(1);
  const [cardvm, setcardvm] = useState(1);
  const [cardinfusoes, setcardinfusoes] = useState(1);
  const [carddieta, setcarddieta] = useState(1);
  const [cardculturas, setcardculturas] = useState(1);
  const [cardatb, setcardatb] = useState(1);
  const [cardinterconsultas, setcardinterconsultas] = useState(1);
  const [cardexames, setcardexames] = useState(1);
  const [cardprescricao, setcardprescricao] = useState(1);

  // estado para seleção dos cards do passômetro.
  const [card, setcard] = useState("");

  const [pacientes, setpacientes] = useState([]);
  const [paciente, setpaciente] = useState([]);
  const [atendimentos, setatendimentos] = useState([]);

  const [atendimento, setatendimento] = useState(null); // usado para identificar o id_atendimento.
  const [objatendimento, setobjatendimento] = useState(''); // usado para recuperar todos os dados do objeto atendimento.

  const [alergias, setalergias] = useState([]);
  const [lesoes, setlesoes] = useState([]);
  const [precaucoes, setprecaucoes] = useState([]);
  const [riscos, setriscos] = useState([]);
  const [culturas, setculturas] = useState([]);
  const [arrayculturas, setarrayculturas] = useState([]);
  const [antibioticos, setantibioticos] = useState([]);
  const [arrayantibioticos, setarrayantibioticos] = useState([]);
  const [dietas, setdietas] = useState([]);
  const [evolucoes, setevolucoes] = useState([]);
  const [arrayevolucoes, setarrayevolucoes] = useState([]);
  const [infusoes, setinfusoes] = useState([]);
  const [invasoes, setinvasoes] = useState([]);
  const [propostas, setpropostas] = useState([]);
  const [arraypropostas, setarraypropostas] = useState([]);
  const [sinaisvitais, setsinaisvitais] = useState([]);
  const [vm, setvm] = useState([]);
  const [interconsultas, setinterconsultas] = useState([]);

  const [prescricao, setprescricao] = useState([]);
  const [arrayitensprescricao, setarrayitensprescricao] = useState([]);

  const [consultorio, setconsultorio] = useState('SELECIONAR SALA'); // seletor da sala de atendimento.
  const [salatriagem, setsalatriagem] = useState(null); // seletor da sala de triagem.

  const [tipodocumento, settipodocumento] = useState(null);
  const [documentos, setdocumentos] = useState([]);
  const [selecteddocumento, setselecteddocumento] = useState([]);
  const [selecteddocumentoestruturado, setselecteddocumentoestruturado] = useState([]);

  const [laboratorio, setlaboratorio] = useState([]);
  const [arrayespecialidades, setarrayespecialidades] = useState([
    'ANESTESIOLOGIA',
    'CARDIOLOGIA',
    'CLÍNICA MÉDICA',
    'CIRURGIA GERAL',
    'CIRURGIA TORÁCICA',
    'UROLOGIA',
    'RADIOLOGIA',
    'MEDICINA INTENSIVA',
  ]);

  // largura do dispositivo (global).
  const [mobilewidth, setmobilewidth] = useState(600);

  const [idprescricao, setidprescricao] = useState(0);

  // almoxarifado.
  const [almoxarifado, setalmoxarifado] = useState([]);

  // faturamento.
  const [aih, setaih] = useState([]);

  // resolvendo a responsividade para o innerHeight nos celulares.
  const [altura, setaltura] = useState(`${window.innerHeight}px`);
  const documentHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty("--doc-height", `${window.innerHeight}px`);
  };
  window.addEventListener("resize", documentHeight);
  documentHeight();

  window.history.pushState({ page: 1 }, "", "");
  window.onpopstate = function (event) {
    if (event) {
      window.history.pushState({ page: 1 }, "", "");
    }
  };

  return (
    <Context.Provider
      value={{
        html,
        htmlnirvana,
        
        toast,
        settoast,
        dialogo,
        setdialogo,

        viewdatepicker,
        setviewdatepicker,
        pickdate1,
        setpickdate1,
        pickdate2,
        setpickdate2,

        cliente,
        setcliente,
        unidades,
        setunidades,
        hospital,
        sethospital,
        unidade,
        setunidade,
        usuario,
        setusuario,
        usuarios, setusuarios,
        dono_documento, setdono_documento,

        pagina,
        setpagina,

        settings,
        setsettings,
        tema,
        settema,
        carddiasinternacao,
        setcarddiasinternacao,
        cardalergias,
        setcardalergias,
        cardanamnese,
        setcardanamnese,
        cardevolucoes,
        setcardevolucoes,
        cardpropostas,
        setcardpropostas,
        cardprecaucoes,
        setcardprecaucoes,
        cardriscos,
        setcardriscos,
        cardalertas,
        setcardalertas,
        cardsinaisvitais,
        setcardsinaisvitais,
        cardbody,
        setcardbody,
        cardvm,
        setcardvm,
        cardinfusoes,
        setcardinfusoes,
        carddieta,
        setcarddieta,
        cardculturas,
        setcardculturas,
        cardatb,
        setcardatb,
        cardinterconsultas,
        setcardinterconsultas,
        cardexames,
        setcardexames,
        cardprescricao,
        setcardprescricao,

        card,
        setcard,

        pacientes,
        setpacientes,
        paciente,
        setpaciente,
        atendimentos,
        setatendimentos,
        atendimento,
        setatendimento,
        objatendimento,
        setobjatendimento,

        alergias,
        setalergias,
        lesoes,
        setlesoes,
        precaucoes,
        setprecaucoes,
        riscos,
        setriscos,
        culturas,
        setculturas,
        arrayculturas,
        setarrayculturas,
        antibioticos,
        setantibioticos,
        arrayantibioticos,
        setarrayantibioticos,
        dietas,
        setdietas,
        evolucoes,
        setevolucoes,
        arrayevolucoes,
        setarrayevolucoes,
        infusoes,
        setinfusoes,
        invasoes,
        setinvasoes,
        propostas,
        setpropostas,
        arraypropostas,
        setarraypropostas,
        sinaisvitais,
        setsinaisvitais,
        vm,
        setvm,
        interconsultas,
        setinterconsultas,
        prescricao,
        setprescricao,
        arrayitensprescricao,
        setarrayitensprescricao,
        altura,
        setaltura,
        consultorio,
        setconsultorio,
        salatriagem,
        setsalatriagem,
        tipodocumento, settipodocumento,
        documentos, setdocumentos,
        selecteddocumento, setselecteddocumento,
        selecteddocumentoestruturado, setselecteddocumentoestruturado,
        laboratorio, setlaboratorio,
        arrayespecialidades, setarrayespecialidades,
        mobilewidth, setmobilewidth,
        idprescricao, setidprescricao,
        almoxarifado, setalmoxarifado,
        aih, setaih,
      }}
    >
      <div>
        <Router>
          <Switch>
            <Route exact path="/">
              <Login></Login>
            </Route>
            <Route path="/prontuario">
              <Prontuario></Prontuario>
            </Route>
            <Route path="/prontuario_todos_pacientes">
              <ProntuarioTodosPacientes></ProntuarioTodosPacientes>
            </Route>
            <Route path="/consultas">
              <Consultas></Consultas>
            </Route>
            <Route path="/cadastro">
              <Cadastro></Cadastro>
            </Route>
            <Route path="/usuarios">
              <Usuarios></Usuarios>
            </Route>
            <Route path="/triagem">
              <Triagem></Triagem>
            </Route>
            <Route path="/painel">
              <Painel></Painel>
            </Route>
            <Route path="/laboratorio">
              <Laboratorio></Laboratorio>
            </Route>
            <Route path="/farmacia">
              <Farmacia></Farmacia>
            </Route>
            <Route path="/almoxarifado">
              <Almoxarifado></Almoxarifado>
            </Route>
            <Route path="/faturamento">
              <Faturamento></Faturamento>
            </Route>
            <Route path="/resultados">
              <Resultados></Resultados>
            </Route>
            <Route path="/agendamento">
              <Agendamento></Agendamento>
            </Route>
          </Switch>
        </Router>
        <Toast></Toast>
        <Modal></Modal>
        <DatePicker></DatePicker>
      </div>
    </Context.Provider>
  );
}

export default App;
