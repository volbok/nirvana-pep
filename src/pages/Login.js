/* eslint eqeqeq: "off" */
import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import Context from "./Context";
// funções.
import toast from "../functions/toast";
// imagens.
import power from "../images/power.svg";
import salvar from "../images/salvar.svg";
import back from "../images/back.svg";

// componentes.
import Logo from "../components/Logo";
// router.
import { useHistory } from "react-router-dom";

var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(5);


function Login() {
  // context.
  const {
    html,
    setsettings,
    pagina,
    setpagina,
    settoast,
    setunidades,
    setusuario,
    usuario,
    setusuarios,
    setcliente,
    sethospital,
    mobilewidth,
    setoperadoras,
    setpaciente,
  } = useContext(Context);

  // history (router).
  let history = useHistory();

  useEffect(() => {
    if (pagina == 0) {
      sethospital(0);
      loadUnidades();
      loadUsuarios();
      loadOperadoras();

      if (usuario.id != undefined) {
        // setusuario(JSON.parse(localStorage.getItem('obj_usuario')));
        loadAcessos(usuario.id);
        loadUnidades();
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
        loadClientes();
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
          codigo_cbo: x.codigo_cbo,
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

  // lista de unidades de apoio.
  const montaModuloDeApoio = (titulo, acesso, rota, pagina) => {
    return (
      <div
        className="button"
        style={{
          display: acesso != 0 || acesso != null ? "flex" : "none",
          minWidth: window.innerWidth < mobilewidth ? "30vw" : "10vw",
          maxWidth: window.innerWidth < mobilewidth ? "30vw" : "10vw",
          height: window.innerWidth < mobilewidth ? "30vw" : "10vw",
          minHeight: window.innerWidth < mobilewidth ? "30vw" : "10vw",
          maxHeight: window.innerWidth < mobilewidth ? "30vw" : "10vw",
          margin: 5,
          padding: 10,
        }}
        onClick={() => {
          history.push(rota);
          setpagina(pagina);
          localStorage.setItem("viewlistaunidades", 1);
          localStorage.setItem("viewlistamodulos", 1);
        }}
      >
        {titulo}
      </div>
    );
  };

  const loadOperadoras = () => {
    axios.get(html + 'all_operadoras').then((response) => {
      setoperadoras(response.data.rows);
    })
  };

  function ListaDeUnidadesDeApoio() {
    return (
      <div
        style={{
          display: viewlistaunidades == 1 && window.innerWidth > mobilewidth ? "flex" : "none",
          flexDirection: "column",
          justifyContent: "center",
          alignSelf: "center",
          marginTop: 20,
        }}
      >
        <div className="text2"
          style={{
            fontSize: 16,
            display: usuario.paciente == 1 || usuario.laboratorio == 1 || usuario.farmacia == 1 || usuario.faturamento == 1 || usuario.usuarios == 1 ? 'flex' : 'none',
          }}>
          MÓDULOS ADMINISTRATIVOS
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {montaModuloDeApoio(
            "CADASTRO DE PACIENTES E MARCAÇÃO DE CONSULTAS",
            usuario.paciente,
            "/cadastro",
            2
          )}
          {montaModuloDeApoio(
            "CADASTRO DE USUÁRIOS",
            usuario.usuarios,
            "/usuarios",
            5
          )}
          {montaModuloDeApoio(
            "FATURAMENTO",
            usuario.faturamento,
            "/faturamento",
            "FATURAMENTO"
          )}
          {montaModuloDeApoio(
            "FINANCEIRO",
            usuario.faturamento,
            "/financeiro",
            "FINANCEIRO"
          )}
        </div>
      </div>
    );
  }

  const [clientes, setclientes] = useState([]);
  const loadClientes = () => {
    axios.get(html + 'list_hospitais').then((response) => {
      setclientes(response.data.rows);
    })
  }

  function ClienteSelector() {
    return (
      <div style={{ display: usuario != {} && viewlistaunidades == 0 ? 'flex' : 'none', alignSelf: 'center' }}>
        {acessos.map(item => (
          <div className="button" style={{ width: 200, height: 200 }}
            onClick={() => {
              setcliente(clientes.filter(valor => valor.id_cliente == item.id_cliente).pop());
              sethospital(clientes.filter(valor => valor.id_cliente == item.id_cliente).map(item => item.id_cliente).pop());
              // console.log(clientes.filter(valor => valor.id_cliente == item.id_cliente).map(item => item.id_cliente));
              // console.log(clientes.filter(valor => valor.id_cliente == item.id_cliente).pop());
              setviewlistaunidades(1);
            }}
          >
            {clientes.filter(valor => valor.id_cliente == item.id_cliente).map(item => item.nome_cliente)}
          </div>
        ))}
      </div>
    )
  }

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
          MÓDULOS DE ATENDIMENTO
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
              setpagina(-2);
              history.push("/consultas");
              console.log(usuario);
            }}
          >
            CONSULTAS
          </div>
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
              setpaciente(null);
              setpagina(20);
              history.push("/agendamento");
            }}
          >
            AGENDAMENTOS
          </div>
        </div>
      </div>
    );
  }

  // ## TROCA DE SENHA ## //
  // atualizar usuário.
  const updateUsuario = () => {
    let novasenha = document.getElementById("inputNovaSenha").value;
    let repetesenha = document.getElementById("inputConfirmaSenha").value;

    // gerando senha criptografada com o bcrypt.
    var password = document.getElementById("inputNovaSenha").value;
    var hash = bcrypt.hashSync(password, salt);

    if (novasenha == repetesenha) {
      var obj = {
        nome_usuario: usuario.nome_usuario,
        dn_usuario: usuario.dn_usuario,
        cpf_usuario: usuario.cpf_usuario,
        email_usuario: usuario.email_usuario,
        senha: hash,
        login: usuario.cpf_usuario,
        conselho: usuario.conselho,
        n_conselho: usuario.n_conselho,
        tipo_usuario: usuario.tipo_usuario,
        paciente: usuario.paciente,
        prontuario: usuario.prontuario,
        laboratorio: usuario.laboratorio,
        farmacia: usuario.farmacia,
        faturamento: usuario.faturamento,
        usuarios: usuario.usuarios,
        primeiro_acesso: usuario.primeiro_acesso,
        almoxarifado: usuario.almoxarifado,
      };
      axios
        .post(html + "update_usuario/" + usuario.id, obj)
        .then(() => {
          setviewalterarsenha(0);
          toast(
            settoast,
            "SENHA ATUALIZADA COM SUCESSO NA BASE PULSAR",
            "rgb(82, 190, 128, 1)",
            3000
          );
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
            history.push("/");
          }, 5000);
        });
    } else {
      document.getElementById("inputNovaSenha").value = "";
      document.getElementById("inputConfirmaSenha").value = "";
      document.getElementById("inputNovaSenha").focus();
      toast(
        settoast,
        "SENHA REPETIDA NÃO CONFERE",
        "rgb(231, 76, 60, 1)",
        3000
      );
    }
  };
  function AlterarSenha() {
    return (
      <div
        style={{
          display: viewalterarsenha == 1 ? "flex" : "none",
          flexDirection: "column",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <div className="text3" style={{ color: "white", fontSize: 16 }}>
          {usuario.nome_usuario}
        </div>
        <div className="text1" style={{ color: "white" }}>
          DIGITE A NOVA SENHA
        </div>
        <input
          autoComplete="off"
          placeholder="NOVA SENHA"
          className="input"
          type="password"
          id="inputNovaSenha"
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "NOVA SENHA")}
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 200,
            height: 50,
            alignSelf: "center",
          }}
        ></input>
        <div className="text1" style={{ color: "white" }}>
          CONFIRME A NOVA SENHA
        </div>
        <input
          autoComplete="off"
          placeholder="REPITA SENHA"
          className="input"
          type="password"
          id="inputConfirmaSenha"
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "REPITA SENHA")}
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 200,
            height: 50,
            alignSelf: "center",
          }}
        ></input>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <div
            id="btnTrocarSenha"
            title="ALTERAR SENHA"
            className="button-green"
            onClick={() => updateUsuario()}
            style={{ width: 50, height: 50, alignSelf: "center" }}
          >
            <img
              alt=""
              src={salvar}
              style={{
                margin: 10,
                height: 30,
                width: 30,
              }}
            ></img>
          </div>
          <div
            id="btnCancelaTrocarSenha"
            title="CANCELAR ALTERAÇÃO DA SENHA"
            className="button-red"
            onClick={() => {
              setviewalterarsenha(0);
              setviewlistaunidades(1);
            }}
            style={{ width: 50, height: 50, alignSelf: "center" }}
          >
            <img
              alt=""
              src={back}
              style={{
                margin: 10,
                height: 30,
                width: 30,
              }}
            ></img>
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
        className="chassi" style={{ overflowY: 'scroll', width: 'calc(100% - 10px)' }}
        id="conteúdo do login"
      >
        <div
          className="text2 popin"
          style={{
            display:
              window.innerWidth < mobilewidth && viewalterarsenha == 1
                ? "none"
                : "flex",
          }}
        >
          <Logo href="/site/index.html" target="_blank" rel="noreferrer" height={150} width={150}></Logo>
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
            display: viewlistaunidades == 1 || viewalterarsenha == 1 ? 'flex' : 'none',
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
        <AlterarSenha></AlterarSenha>
        <ClienteSelector></ClienteSelector>
        <ListaDeUnidadesAssistenciais></ListaDeUnidadesAssistenciais>
        <ListaDeUnidadesDeApoio></ListaDeUnidadesDeApoio>
        <div
          className="button-red"
          style={{
            display: "flex",
            position: "sticky",
            top: 10,
            right: 10,
            alignSelf: 'center',
            marginBottom: 20
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
      </div>
    </div >
  );
}

export default Login;
