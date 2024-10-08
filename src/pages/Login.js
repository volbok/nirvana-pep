/* eslint eqeqeq: "off" */
import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import Context from "./Context";
// funções.
import toast from "../functions/toast";
// imagens.
import power from "../images/power.svg";
// componentes.
import Logo from "../components/Logo";
// router.
import { useHistory } from "react-router-dom";

var bcrypt = require('bcryptjs');

function Login() {
  // context.
  const {
    html,
    setsettings,
    pagina,
    setpagina,
    settoast,
    sethospital,
    setunidades,
    setusuario,
    usuario,
    setusuarios,
    cliente,
    mobilewidth,
  } = useContext(Context);

  // history (router).
  let history = useHistory();

  useEffect(() => {
    if (pagina == 0) {
      sethospital(cliente.id_cliente);
      loadUnidades();
      loadUsuarios();

      if (usuario.id != undefined) {
        // setusuario(JSON.parse(localStorage.getItem('obj_usuario')));
        loadAcessos(usuario.id);
        loadUnidades();
        setviewlistaunidades(1);
      } else {
        setviewlistaunidades(0);
        loadUnidades();
        loadUsuarios();
      }
    }
    // eslint-disable-next-line
  }, [pagina]);

  // carregar configurações do usuário logado.
  // eslint-disable-next-line
  const [tema, settema] = useState(1);
  const loadSettings = (usuario) => {
    axios.get(html + "settings/" + usuario).then((response) => {
      var x = [];
      x = response.data.rows;
      changeTema(x.map((item) => item.tema));
      settema(x.map((item) => item.tema));
      setsettings(response.data.rows);
      if (x.length < 1) {
        var obj = {
          id_usuario: usuario,
          tema: 1,
          card_diasinternacao: 1,
          card_alergias: 1,
          card_anamnese: 1,
          card_evolucoes: 1,
          card_propostas: 1,
          card_precaucoes: 1,
          card_riscos: 1,
          card_alertas: 1,
          card_sinaisvitais: 1,
          card_body: 1,
          card_vm: 1,
          card_infusoes: 1,
          card_dieta: 1,
          card_culturas: 1,
          card_antibioticos: 1,
          card_interconsultas: 1,
        };
        axios
          .post(html + "insert_settings", obj)
          .then(() => {
            toast(
              settoast,
              "CONFIGURAÇÕES PESSOAIS ARMAZENADAS NA BASE PULSAR",
              "rgb(82, 190, 128, 1)",
              3000
            );
            axios
              .get(html + "settings/" + usuario)
              .then((response) => {
                setsettings(response.data.rows);
              })
              .catch(function (error) {
                console.log(error);
              });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    });
  };

  // carregando o tema de cores da aplicação.
  // função para seleção de esquemas de cores (temas) da aplicação.
  const changeTema = (tema) => {
    if (tema == 1) {
      // tema AZUL.
      document.documentElement.style.setProperty(
        "--cor1",
        "rgba(64, 74, 131, 0.7)"
      );
      document.documentElement.style.setProperty(
        "--cor1hover",
        "rgba(64, 74, 131, 1)"
      );
      document.documentElement.style.setProperty(
        "--cor2",
        "rgba(242, 242, 242)"
      );
      document.documentElement.style.setProperty(
        "--cor3",
        "rgba(215, 219, 221)"
      );
      document.documentElement.style.setProperty(
        "--texto1",
        "rgba(97, 99, 110, 1)"
      );
      document.documentElement.style.setProperty("--texto2", "#ffffff");
      document.documentElement.style.setProperty(
        "--texto3",
        "rgba(64, 74, 131, 1)"
      );
      document.documentElement.style.setProperty(
        "--placeholder",
        "rgb(97, 99, 110, 0.6)"
      );
      document.documentElement.style.setProperty("--cor0", "white");
    } else if (tema == 2) {
      // tema VERDE.
      document.documentElement.style.setProperty(
        "--cor1",
        "rgba(26, 188, 156, 0.7)"
      );
      document.documentElement.style.setProperty(
        "--cor1hover",
        "rgba(26, 188, 156, 1)"
      );
      document.documentElement.style.setProperty(
        "--cor2",
        "rgba(242, 242, 242)"
      );
      document.documentElement.style.setProperty(
        "--cor3",
        "rgba(215, 219, 221)"
      );
      document.documentElement.style.setProperty(
        "--texto1",
        "rgba(97, 99, 110, 1)"
      );
      document.documentElement.style.setProperty("--texto2", "#ffffff");
      document.documentElement.style.setProperty("--texto3", "#48C9B0");
      document.documentElement.style.setProperty(
        "--placeholder",
        "rgb(97, 99, 110, 0.6)"
      );
      document.documentElement.style.setProperty("--cor0", "white");
    } else if (tema == 3) {
      // tema PRETO.
      document.documentElement.style.setProperty(
        "--cor1",
        "rgb(86, 101, 115, 0.6)"
      );
      document.documentElement.style.setProperty(
        "--cor1hover",
        "rgb(86, 101, 115, 1)"
      );
      document.documentElement.style.setProperty(
        "--cor2",
        "rgb(23, 32, 42, 1)"
      );
      document.documentElement.style.setProperty("--cor3", "black");
      document.documentElement.style.setProperty("--texto1", "#ffffff");
      document.documentElement.style.setProperty("--texto2", "#ffffff");
      document.documentElement.style.setProperty("--texto3", "#ffffff");
      document.documentElement.style.setProperty(
        "--placeholder",
        "rgb(255, 255, 255, 0.5)"
      );
      document.documentElement.style.setProperty("--cor0", "#000000");
    } else {
      document.documentElement.style.setProperty(
        "--cor1",
        "rgba(64, 74, 131, 0.7)"
      );
      document.documentElement.style.setProperty(
        "--cor1hover",
        "rgba(64, 74, 131, 1)"
      );
      document.documentElement.style.setProperty(
        "--cor2",
        "rgba(242, 242, 242)"
      );
      document.documentElement.style.setProperty(
        "--cor3",
        "rgba(215, 219, 221)"
      );
      document.documentElement.style.setProperty(
        "--texto1",
        "rgba(97, 99, 110, 1)"
      );
      document.documentElement.style.setProperty("--texto2", "#ffffff");
      document.documentElement.style.setProperty(
        "--texto3",
        "rgba(64, 74, 131, 1)"
      );
      document.documentElement.style.setProperty(
        "--placeholder",
        "rgb(97, 99, 110, 0.6)"
      );
      document.documentElement.style.setProperty("--cor0", "white");
    }
  };

  // recuperando registros de unidades cadastradas na aplicação.
  const loadUnidades = () => {
    axios
      .get(html + "list_unidades")
      .then((response) => {
        setunidades(response.data.rows);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const loadUsuarios = () => {
    axios
      .get(html + "list_usuarios")
      .then((response) => {
        setusuarios(response.data.rows);
        /*
        ACESSOS AOS MÓDULOS DE USUÁRIO (tabela usuarios):
        10 - MÉDICO(A)
        11 - ENFERMEIRO(A)
        12 - TÉCNICO(A) DE ENFERMAGEM
        13 - FISIOTERAPEUTA
        14 - FONOAUDIOLOGO(A)
        15 - TERAPEUTA OCUPACIONAL
        16 - ASSISTENTE SOCIAL
        17 - PSICOLOGO(A)
        18 - RADIOLOGIA
        20 - GERENTE
        21 - ADMINISTRATIVO
        */
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // recuperando registros de acessos do usuário logado.
  // eslint-disable-next-line
  const [acessos, setacessos] = useState([]);
  const loadAcessos = (id_usuario) => {
    var obj = {
      id_usuario: id_usuario,
    };
    axios
      .post(
        html + "getunidades",
        obj
        /*
        Forma de passar o token pelo header (deve ser repetida em toda endpoint).
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
        */
      )
      .then((response) => {
        setacessos(response.data.rows);
        setviewlistaunidades(1);
        setviewalterarsenha(0);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // checando se o usuário inserido está registrado no sistema.
  let password = null;
  var timeout = null;
  const checkLogin = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      password = document.getElementById("inputSenha").value;
      let usuario = localStorage.getItem('usuario');
      let senha = localStorage.getItem('senha');
      if (bcrypt.compareSync(password, senha) == true) {
        var obj = {
          usuario: parseInt(usuario),
        };
        axios
          .post(html + "grant", obj)
          .then((response) => {
            var x = [];
            x = response.data;
            // armazenando o token no localStorage.
            localStorage.setItem("token", x.token);
            setAuthToken(x.token);
            if (x.auth == true) {

              /*
              toast(
                settoast,
                "OLÁ, " + usuario.nome.split(" ", 1),
                "rgb(82, 190, 128, 1)",
                3000
              );
              */

              // eslint-disable-next-line
              setviewlistaunidades(1);
              loadAcessos(x.id.usuario);
              loadSettings(x.id.usuario);
            } else {
              toast(
                settoast,
                "USUÁRIO OU SENHA INCORRETOS",
                "rgb(231, 76, 60, 1)",
                3000
              );
            }
          })
          .catch(function () {
            toast(
              settoast,
              "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
              "black",
              5000
            );
            setTimeout(() => {
              setpagina(0);
              setusuario({})
              history.push("/");
            }, 5000);
          });
      } else {
        toast(settoast, 'USUÁRIO E SENHA NÃO CONFEREM', 'red', 1000);
      }

    }, 1000);
  };

  // forma mais inteligente de adicionar o token ao header de todas as requisições.
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
    } else delete axios.defaults.headers.common["Authorization"];
  };

  const checkUsuario = (usuario) => {
    var obj = { usuario: usuario }
    axios.post(html + "checknomeusuario", obj)
      .then((response) => {
        var x = response.data;
        // salvando os dados do usuário logado.
        var obj = {
          id: x.id,
          nome_usuario: x.nome,
          dn_usuario: x.dn,
          cpf_usuario: x.cpf,
          email_usuario: x.email,
          senha: x.senha,
          login: x.login,
          conselho: x.conselho,
          n_conselho: x.n_conselho,
          tipo_usuario: x.tipo_usuario,
          paciente: x.paciente,
          prontuario: x.prontuario,
          laboratorio: x.laboratorio,
          farmacia: x.farmacia,
          faturamento: x.faturamento,
          usuarios: x.usuarios,
          primeiro_acesso: x.primeiro_acesso,
        }

        setusuario(obj);
        localStorage.setItem('obj_usuario', JSON.stringify(obj));
        localStorage.setItem('usuario', x.id);
        localStorage.setItem('senha', x.senha);
        if (x.id != undefined && x.primeiro_acesso != 1) {
        } else if (x.id == undefined) {
          document.getElementById("inputSenha").style.opacity = 0.3;
          document.getElementById("inputSenha").style.pointerEvents = 'none';
          toast(settoast, 'USUÁRIO INEXISTENTE', 'red', 1000);
        } else {
          document.getElementById("inputSenha").style.opacity = 1;
          document.getElementById("inputSenha").style.pointerEvents = 'auto';
        }
      })
  };

  // inputs para login e senha.
  const [viewlistaunidades, setviewlistaunidades] = useState(0);
  const [viewalterarsenha, setviewalterarsenha] = useState(0);
  const Inputs = useCallback(() => {
    var timeout = null;
    return (
      <div
        style={{
          display:
            viewlistaunidades == 1 || viewalterarsenha == 1 ? "none" : "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <input
          autoComplete="off"
          placeholder="USUÁRIO"
          className="input"
          type="text"
          id="inputUsuario"
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "USUÁRIO")}
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 200,
            height: 50,
          }}
          onKeyUp={() => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              checkUsuario(document.getElementById("inputUsuario").value);
            }, 2000);
          }}
        ></input>
        <input
          autoComplete="off"
          placeholder="SENHA"
          className="input"
          type="password"
          id="inputSenha"
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "SENHA")}
          onChange={() => {
            checkLogin();
          }}
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 200,
            height: 50,
            opacity: 0.3,
            pointerEvents: 'none'
          }}
        ></input>
      </div>
    );
    // eslint-disable-next-line
  }, [viewlistaunidades, viewalterarsenha]);

  // lista de unidades disponiveis para o usuário logado.

  function ListaDeUnidadesAssistenciais() {
    return (
      <div
        style={{
          display: viewlistaunidades == 1 ? "flex" : "none",
          flexDirection: "column",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <div className="text2" style={{ fontSize: 16, display: usuario.prontuario == 1 ? 'flex' : 'none' }}>
          UNIDADES ASSISTENCIAIS
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
            width: window.innerWidth < mobilewidth ? "80vw" : "45vw",
          }}
        >
          <div
            className="button"
            style={{
              display: "flex",
              padding: 10,
              margin: 5,
              minWidth: window.innerWidth < mobilewidth ? "30vw" : "15vw",
              maxWidth: window.innerWidth < mobilewidth ? "30vw" : "15vw",
              height: window.innerWidth < mobilewidth ? "30vw" : "15vw",
              minHeight: window.innerWidth < mobilewidth ? "30vw" : "15vw",
              maxHeight: window.innerWidth < mobilewidth ? "30vw" : "15vw",
              color: 'white',
            }}
            onClick={() => {
              setpagina(-1);
              history.push("/prontuario_todos_pacientes");
              console.log(usuario);
            }}
          >
            TODOS OS PACIENTES
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="main"
      style={{ display: pagina == 0 ? "flex" : "none" }}
    >
      <div
        className="chassi"
        id="conteúdo do login"
      >
        <div
          className="button-red"
          style={{
            display: "flex",
            position: "sticky",
            top: 10,
            right: 10,
            alignSelf: 'flex-end'
          }}
          title="FAZER LOGOFF."
          onClick={() => {
            setusuario({});
            setacessos([]);
            setviewlistaunidades(0);
            setviewalterarsenha(0);
          }}
        >
          <img
            alt=""
            src={power}
            style={{
              margin: 0,
              height: 30,
              width: 30,
            }}
          ></img>
        </div>
        <div
          className="text2 popin"
          style={{
            display:
              window.innerWidth < mobilewidth && viewalterarsenha == 1
                ? "none"
                : "flex",
          }}
        >
          <Logo href="/site/index.html" target="_blank" rel="noreferrer" height={200} width={200}></Logo>
        </div>
        <div
          className="text2"
          style={{
            display:
              window.innerWidth < mobilewidth && viewalterarsenha == 1
                ? "none"
                : "flex",
            margin: 20, marginTop: 10,
            fontSize: 28,

          }}
        >
          PULSAR
        </div>
        <div
          style={{
            display: "none",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <a
            className="text2"
            style={{ cursor: "pointer" }}
            href="/site/index.html"
            target="_blank"
            rel="noreferrer"
          >
            SAIBA MAIS
          </a>
        </div>
        <div
          className="text1"
          style={{
            display: "none",
            textDecoration: "underline",
            color: "white",
            marginTop:
              window.innerWidth < mobilewidth && viewalterarsenha == 1 ? 20 : 0,
          }}
          onClick={() => {
            if (viewalterarsenha == 1) {
              setviewalterarsenha(0);
              setviewlistaunidades(1);
            } else {
              setviewalterarsenha(1);
              setviewlistaunidades(0);
            }
          }}
        >
          ALTERAR SENHA
        </div>
        <Inputs></Inputs>
        <ListaDeUnidadesAssistenciais></ListaDeUnidadesAssistenciais>
        <div
          className="text1"
          style={{
            display: "flex",
            textDecoration: "underline",
            color: "white",
            marginTop:
              window.innerWidth < mobilewidth && viewalterarsenha == 1 ? 20 : 0,
          }}
          onClick={() => {
            setpagina('RESULTADOS');
            history.push("/resultados");
          }}
        >
          RESULTADOS DE EXAMES
        </div>
      </div>
    </div >
  );
}

export default Login;
