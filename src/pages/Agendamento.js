/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState, useCallback } from 'react';
import Context from './Context';
import axios from 'axios';
// imagens.
import deletar from '../images/deletar.svg';
import back from '../images/back.svg';
import moment from "moment";
import lupa from '../images/lupa_cinza.svg';
import imprimir from '../images/imprimir.svg';
import salvar from '../images/salvar.svg';
// funções.
import maskdate from "../functions/maskdate";
// router.
import { useHistory } from "react-router-dom";
import modal from '../functions/modal';
import GuiaConsulta from '../cards/GuiaConsulta';

function Agendamento() {

  // context.
  const {
    pagina, setpagina,
    html,
    hospital,
    pacientes, setpacientes,
    paciente, setpaciente,
    setobjpaciente,
    setdialogo,
    setcard,
    setdono_documento,
    mobilewidth,
    usuario,
  } = useContext(Context);

  const [viewupdateatendimento, setviewupdateatendimento] = useState(0);
  useEffect(() => {
    // eslint-disable-next-line
    if (pagina == 20) {
      loadUsuarios();
      loadPacientes();
      loadAtendimentos();
      currentMonth();
    }
    if (paciente == null) {
      setlistatodosatendimentos(1);
    }
    // eslint-disable-next-line
  }, [pagina]);

  // history (router).
  let history = useHistory();

  var timeout = null;
  const [especialistas, setespecialistas] = useState([]);
  const [arrayespecialistas, setarrayespecialistas] = useState([]);

  const [filterespecialista, setfilterespecialista] = useState("");
  var searchespecialista = "";
  const filterEspecialista = () => {
    clearTimeout(timeout);
    document.getElementById("inputespecialista").focus();
    searchespecialista = document.getElementById("inputespecialista").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchespecialista == "") {
        setfilterespecialista("");
        setarrayespecialistas(especialistas);
        document.getElementById("inputespecialista").value = "";
        setTimeout(() => { document.getElementById("inputespecialista").focus() }, 100);
      } else {
        setfilterespecialista(document.getElementById("inputespecialista").value.toUpperCase());
        if (especialistas.filter((item) => item.nome_usuario.includes(searchespecialista)).length > 0) {
          setarrayespecialistas(especialistas.filter((item) => item.nome_usuario.includes(searchespecialista)));
          setTimeout(() => {
            document.getElementById("inputespecialista").value = searchespecialista;
            document.getElementById("inputespecialista").focus()
          }, 100)
        } else {
          setarrayespecialistas(especialistas.filter((item) => item.tipo_usuario != null && item.tipo_usuario.includes(searchespecialista)));
          setTimeout(() => {
            document.getElementById("inputespecialista").value = searchespecialista;
            document.getElementById("inputespecialista").focus()
          }, 100)
        }
      };
    }, 1000);
  };
  // filtro de paciente por nome.
  function FilterEspecialista() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
        <input
          className="input"
          autoComplete="off"
          placeholder="BUSCAR ESPECIALISTA..."
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "BUSCAR ESPECIALISTA...")}
          onKeyUp={() => filterEspecialista()}
          type="text"
          id="inputespecialista"
          defaultValue={filterespecialista}
          maxLength={100}
          style={{ width: '30%' }}
        ></input>
      </div>
    );
  }

  const loadUsuarios = () => {
    axios.get(html + "list_usuarios").then((response) => {
      setespecialistas(response.data.rows);
      setarrayespecialistas(response.data.rows);
    })
  };

  const loadPacientes = () => {
    axios
      .get(html + "list_pacientes")
      .then((response) => {
        setpacientes(response.data.rows);
      });
  }

  const [arrayatendimentos, setarrayatendimentos] = useState([]);
  const loadAtendimentos = () => {
    axios
      .get(html + "list_consultas/" + 5) // 5 corresponde ao id da unidade "AMBULATÓRIO".
      .then((response) => {
        var x = response.data.rows;
        var y = x.filter(item => item.id_unidade == 5);
        // item.id_paciente == paciente.id_paciente
        if (window.innerWidth > mobilewidth) {
          setarrayatendimentos(y);
        } else {
          setarrayatendimentos(y.filter(atendimento => atendimento.id_profissional == usuario.id));
        }
      })
  };

  // ENVIO DE MENSAGENS DE AGENDAMENTO DA CONSULTA PELO WHATSAPP.
  /*
  function geraWhatsapp(inicio) {

    const gzappy_url_envia_mensagem = "https://api.gzappy.com/v1/message/send-message/";
    const instance_id = 'L05K3GC2YX03DGWYLDKZQW5L';
    const instance_token = '2d763c00-4b6d-4842-99d7-cb32ea357a80';
    const USER_TOKEN_ID = '3a1d021d-ad34-473e-9255-b9a3e6577cf9';
    const message =
      'Olá, ' + paciente.nome_paciente + '!\n' +
      'Você tem uma consulta agendada com o Dr(a). ' + selectedespecialista.nome_usuario + ', ' + selectedespecialista.tipo_usuario + ',\n' +
      'para o dia ' + inicio + ', na clínica POMERODE.'

    const rawphone = paciente.telefone;
    console.log(rawphone);
    let cleanphone = rawphone.replace("(", "");
    cleanphone = cleanphone.replace(")", "");
    cleanphone = cleanphone.replace("-", "");
    cleanphone = cleanphone.replace(" ", "");
    cleanphone = "55" + cleanphone;
    console.log(cleanphone);

    fetch(gzappy_url_envia_mensagem, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user_token_id': USER_TOKEN_ID
      },
      body: JSON.stringify({
        instance_id: instance_id,
        instance_token: instance_token,
        message: [message],
        phone: [cleanphone]
      })
    })
  }
  */

  const insertAtendimento = (inicio) => {
    var obj = {
      data_inicio: moment(inicio, 'DD/MM/YYYY - HH:mm'),
      data_termino: localStorage.getItem('PARTICULAR') == 'PARTICULAR' ? moment(inicio, 'DD/MM/YYYY - HH:mm').add(45, 'minutes') : moment(inicio, 'DD/MM/YYYY - HH:mm').add(30, 'minutes'),
      problemas: null,
      id_paciente: paciente.id_paciente,
      id_unidade: 5, // ATENÇÃO: 5 é o ID da unidade ambulatorial.
      nome_paciente: paciente.nome_paciente,
      leito: null,
      situacao: 3, // 3 = atendimento ambulatorial (consulta).
      id_cliente: hospital,
      classificacao: null,
      id_profissional: selectedespecialista.id_usuario,
      convenio_id: paciente.convenio_codigo,
      convenio_carteira: paciente.convenio_carteira,
      faturamento_codigo_procedimento: localStorage.getItem('PARTICULAR'),
    };
    console.log(obj);
    axios
      .post(html + "insert_consulta", obj)
      .then(() => {
        console.log('AGENDAMENTO DE CONSULTA INSERIDO COM SUCESSO')
        loadAtendimentos();
        // geraWhatsapp(inicio);
      });
  };

  const updateAtendimento = (item, inicio) => {
    var obj = {
      data_inicio: moment(inicio, 'DD/MM/YYYY - HH:mm'),
      data_termino: localStorage.getItem('PARTICULAR') == 'PARTICULAR' ? moment(inicio, 'DD/MM/YYYY - HH:mm').add(45, 'minutes') : moment(inicio, 'DD/MM/YYYY - HH:mm').add(30, 'minutes'),
      problemas: item.problemas,
      id_paciente: item.id_paciente,
      id_unidade: 5, // ATENÇÃO: 5 é o ID da unidade ambulatorial.
      nome_paciente: item.nome_paciente,
      leito: null,
      situacao: 3, // 3 = atendimento ambulatorial (consulta).
      id_cliente: hospital,
      classificacao: null,
      id_profissional: item.id_profissional,
      convenio_id: item.convenio_codigo,
      convenio_carteira: item.convenio_carteira,
      faturamento_codigo_procedimento: item.faturamento_codigo_procedimento,
    };
    console.log(obj);
    axios
      .post(html + "update_atendimento/" + item.id_atendimento, obj)
      .then(() => {
        console.log('AGENDAMENTO DE CONSULTA ATUALIZADO COM SUCESSO')
        loadAtendimentos();
        // geraWhatsapp(inicio);
      });
  };

  const geraGuiaConsulta = () => {
    setcard('guia-consulta');
    document.getElementById("guia-consulta").style.display = 'flex';
    document.getElementById("guia-consulta").style.visibility = 'visible';
  }

  // excluir um atendimento.
  const deleteAtendimento = (id) => {
    axios.get(html + "delete_atendimento/" + id).then(() => {
      console.log('DELETANDO AGENDAMENTO DE CONSULTA');
      loadAtendimentos();
    });
  };

  const [selectedespecialista, setselectedespecialista] = useState([]);
  function ListaDeEspecialistas() {
    return (
      <div id="scroll especiaistas"
        className='grid'
        style={{
          // display: listatodosatendimentos == 0 && selectedespecialista.length == 0 ? 'grid' : 'none',
          display: selectedespecialista.length == 0 ? 'grid' : 'none',
          width: '100%',
        }}
        onClick={(e) => e.stopPropagation(e)}
      >
        {arrayespecialistas.filter(item => item.conselho != null)
          .sort((a, b) => (a.nome_usuario > b.nome_usuario ? 1 : -1))
          .map((item) => (
            <div
              key={"usuarios " + Math.random()}
              style={{
                display: arrayespecialistas.length > 0 ? "flex" : "none",
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                height: 200,
              }}
              className="button"
              id={"usuario " + item.id_usuario}
              onClick={() => {
                setselectedespecialista(item);
                setviewconsultas(1);
              }}
            >
              <div
                className='button-green'
                style={{ width: 'calc(100% - 20px)', backgroundColor: '#004c4c80' }}
              >
                {item.tipo_usuario}
              </div>
              <div style={{ margin: 5, marginTop: 10, marginBottom: 0, textAlign: 'left', opacity: 0.6 }}>
                {'PROFISSIONAL:'}
              </div>
              <div style={{ margin: 5, marginTop: 0, textAlign: 'left' }}>
                {item.nome_usuario.length > 25 ? item.nome_usuario.slice(0, 25) + '...' : item.nome_usuario}
              </div>
              <div style={{ margin: 5, marginTop: 5, marginBottom: 0, textAlign: 'left', opacity: 0.6 }}>
                {'CONSELHO:'}
              </div>
              <div style={{ margin: 5, marginTop: 0, textAlign: 'left' }}>
                {item.conselho + ' - ' + item.n_conselho}
              </div>
            </div>
          ))
        }
        <div
          className="text1"
          style={{
            display: arrayespecialistas.length == 0 ? "flex" : "none",
            width: '100%',
            opacity: 0.5,
          }}
        >
          SEM USUÁRIOS CADASTRADOS NA APLICAÇÃO
        </div>
      </div >
    );
  };

  const [viewconsultas, setviewconsultas] = useState(0);
  // DATEPICKER (CALENDÁRIO);
  // preparando a array com as datas.
  var arraydate = [];
  const [arraylist, setarraylist] = useState([]);
  // preparando o primeiro dia do mês.
  const [startdate] = useState(moment().startOf('month'));
  // descobrindo o primeiro dia do calendário (último domingo do mês anteior).
  const firstSunday = (x, y) => {
    while (x.weekday() > 0) {
      x.subtract(1, 'day');
      y.subtract(1, 'day');
    }
    // se o primeiro domingo da array ainda cair no mês atual:
    if (x.month() == startdate.month()) {
      x.subtract(7, 'days');
      y.subtract(7, 'days');
    }
  }
  // criando array com 42 dias a partir da startdate.
  const setArrayDate = (x, y) => {
    arraydate = [x.format('DD/MM/YYYY')];
    while (y.diff(x, 'days') > 1) {
      x.add(1, 'day');
      arraydate.push(x.format('DD/MM/YYYY').toString());
    }
  }
  // criando a array de datas baseada no mês atual.
  const currentMonth = () => {
    var x = moment(startdate, 'DD/MM/YYYY');
    var y = moment(startdate).add(42, 'days');
    firstSunday(x, y);
    setArrayDate(x, y);
    setarraylist(arraydate);
  }
  // percorrendo datas do mês anterior.
  const previousMonth = () => {
    startdate.subtract(1, 'month');
    var x = moment(startdate);
    var y = moment(startdate).add(42, 'days');
    firstSunday(x, y);
    setArrayDate(x, y);
    setarraylist(arraydate);
  }
  // percorrendo datas do mês seguinte.
  const nextMonth = () => {
    startdate.add(1, 'month');
    var month = moment(startdate).format('MM');
    var year = moment(startdate).format('YYYY');
    var x = moment('01/' + month + '/' + year, 'DD/MM/YYYY');
    var y = moment('01/' + month + '/' + year, 'DD/MM/YYYY').add(42, 'days');
    firstSunday(x, y);
    setArrayDate(x, y);
    setarraylist(arraydate);
  }

  const [selectdate, setselectdate] = useState(localStorage.getItem('selectdate'));
  function DatePicker() {
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'sticky', top: 5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignSelf: 'center',
          marginRight: -2.5,
        }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
          }}>
            <button
              className="button"
              onClick={(e) => { previousMonth(); e.stopPropagation(); }}
              id="previous"
              style={{
                width: 50,
                height: 50,
                margin: 2.5,
                color: '#ffffff',
              }}
              title={'MÊS ANTERIOR'}
            >
              {'◄'}
            </button>
            <p
              className="text1"
              style={{
                flex: 1,
                fontSize: 16,
                margin: 2.5
              }}>
              {startdate.format('MMMM').toUpperCase() + ' ' + startdate.year()}
            </p>
            <button
              className="button"
              onClick={(e) => { nextMonth(); e.stopPropagation(); }}
              id="next"
              style={{
                width: 50,
                height: 50,
                margin: 2.5,
                color: '#ffffff',
              }}
              title={'PRÓXIMO MÊS'}
            >
              {'►'}
            </button>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            width: window.innerWidth < 426 ? '85vw' : 400,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            padding: 0, margin: 0,
          }}>
            <p className="text1" style={{ width: window.innerWidth < 426 ? 33 : 50, fontSize: 10, margin: 2.5, padding: 0 }}>DOM</p>
            <p className="text1" style={{ width: window.innerWidth < 426 ? 33 : 50, fontSize: 10, margin: 2.5, padding: 0 }}>SEG</p>
            <p className="text1" style={{ width: window.innerWidth < 426 ? 33 : 50, fontSize: 10, margin: 2.5, padding: 0 }}>TER</p>
            <p className="text1" style={{ width: window.innerWidth < 426 ? 33 : 50, fontSize: 10, margin: 2.5, padding: 0 }}>QUA</p>
            <p className="text1" style={{ width: window.innerWidth < 426 ? 33 : 50, fontSize: 10, margin: 2.5, padding: 0 }}>QUI</p>
            <p className="text1" style={{ width: window.innerWidth < 426 ? 33 : 50, fontSize: 10, margin: 2.5, padding: 0 }}>SEX</p>
            <p className="text1" style={{ width: window.innerWidth < 426 ? 33 : 50, fontSize: 10, margin: 2.5, padding: 0 }}>SAB</p>
          </div>
          <div
            id="LISTA DE DATAS"
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              margin: 0,
              padding: 0,
              height: window.innerWidth < 426 ? 340 : '',
              width: window.innerWidth < 426 ? 300 : 400,
              boxShadow: 'none'
            }}
          >
            {arraylist.map((item) => (
              <button
                key={'dia ' + item}
                className={selectdate == item ? "button-selected" : "button"}
                onClick={(e) => {
                  setselectdate(item);
                  localStorage.setItem('selectdate', item);
                  e.stopPropagation()
                }}
                style={{
                  height: 50,
                  margin: 2.5,
                  color: '#ffffff',
                  width: window.innerWidth < 426 ? 33 : 50,
                  minWidth: window.innerWidth < 426 ? 33 : 50,
                  opacity: item.substring(3, 5) === moment(startdate).format('MM') ? 1 : 0.5,
                  position: 'relative',
                }}
                title={item}
              >
                {item.substring(0, 2)}
                <div id='botão para buscar horários...'
                  style={{
                    display: listatodosatendimentos == 1 ? 'none' : 'flex',
                    borderRadius: 50,
                    backgroundColor: 'rgb(82, 190, 128, 1)',
                    borderWidth: 3,
                    borderStyle: 'solid',
                    borderColor: 'rgba(242, 242, 242)',
                    width: 20, height: 20,
                    position: 'absolute',
                    bottom: -5, right: -5,
                    alignContent: 'center',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                  onClick={() => {
                    if (listatodosatendimentos == 1) {
                      setpagina(2);
                      history.push("/cadastro");
                    } else {
                      setviewopcoeshorarios(1)
                    }
                  }}
                >
                  <div>+</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const ListaDeAtendimentos = useCallback(() => {
    return (
      <div
        style={{
          display: listatodosatendimentos == 0 ? 'flex' : 'none',
          flexDirection: "column",
        }}
      >
        <div id="scroll atendimentos com pacientes"
          className='scroll'
          style={{
            display: selectdate != null && arrayatendimentos.filter(item => item.situacao == 3 && moment(item.data_inicio).format('DD/MM/YYYY') == selectdate && item.id_profissional == selectedespecialista.id_usuario).length > 0 ? "flex" : "none",
            flexDirection: 'column',
            justifyContent: "flex-start",
            height: '75vh',
            width: '50vw',
            marginLeft: 20
          }}
        >
          {arrayatendimentos
            .filter(item => item.situacao == 3 && moment(item.data_inicio).format('DD/MM/YYYY') == selectdate && item.id_profissional == selectedespecialista.id_usuario)
            .sort((a, b) => (moment(a.data_inicio) > moment(b.data_inicio) ? 1 : -1))
            .map((item) => (
              <div key={"pacientes" + item.id_atendimento} style={{ width: '100%' }}>
                <div
                  style={{
                    display: 'flex', flexDirection: 'row',
                    position: "relative",
                    margin: 2.5, padding: 0,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: -2.5, left: -2.5,
                      padding: 2.5,
                      paddingLeft: 10, paddingRight: 10,
                      borderRadius: 5,
                      backgroundColor: item.faturamento_codigo_procedimento == 'PARTICULAR' ? 'rgb(82, 190, 128, 1)' : '#03aacd',
                      color: 'white',
                      fontWeight: 'bold',
                      zIndex: 20,
                    }}>
                    {item.faturamento_codigo_procedimento}
                  </div>
                  {ViewUpdateAtendimento(item)}
                  <div id={"btn_lista_atendimento " + item.id_atendimento}
                    className="button"
                    onClick={() => {
                      setviewupdateatendimento(1);
                    }}
                    style={{
                      marginRight: 0,
                      padding: 10,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                      backgroundColor: '#006666',
                      position: 'relative',
                    }}>
                    {moment(item.data_inicio).format('HH:mm') + ' ÀS ' + moment(item.data_termino).format('HH:mm')}
                    <div
                      style={{
                        position: 'absolute',
                        top: -5,
                        left: -5,
                        padding: 2.5,
                        paddingLeft: 10, paddingRight: 10,
                        borderRadius: 5,
                        backgroundColor: item.faturamento_codigo_procedimento == 'PARTICULAR' ? 'rgb(82, 190, 128, 1)' : '#03aacd',
                        color: 'white',
                        fontWeight: 'bold',
                      }}>
                      {item.faturamento_codigo_procedimento}
                    </div>
                  </div>
                  <div
                    id={"lista_atendimento " + item.id_atendimento}
                    className="button"
                    style={{
                      flex: 3,
                      marginLeft: 0,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    }}                    >
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-start",
                          padding: 5,
                          alignSelf: 'center',
                          position: 'relative',
                        }}
                      >
                        <div style={{ textAlign: 'left' }}>
                          {pacientes.filter(
                            (valor) => valor.id_paciente == item.id_paciente
                          )
                            .map((valor) => valor.nome_paciente + ', ' + moment().diff(moment(valor.dn_paciente), 'years') + ' ANOS')}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          {especialistas.filter(valor => valor.id_usuario == item.id_profissional).map(item => 'DR(A). ' + item.nome_usuario + ' - ' + item.conselho + ' ' + item.n_conselho)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div id="btn imprimir guia tiss"
                          title="IMPRIMIR GUIA TISS"
                          className="button-yellow"
                          onClick={() => {
                            setobjpaciente(pacientes.filter(valor => valor.id_paciente == item.id_paciente).pop());
                            setdono_documento(especialistas.filter(valor => valor.id_usuario == item.id_profissional).pop());
                            setTimeout(() => {
                              geraGuiaConsulta();
                            }, 2000);

                          }}
                          style={{ width: 50, height: 50, alignSelf: 'flex-end' }}
                        >
                          <img
                            alt=""
                            src={imprimir}
                            style={{
                              margin: 10,
                              height: 30,
                              width: 30,
                            }}
                          ></img>
                        </div>
                        <div id="btn deletar agendamento de consulta"
                          title="DESMARCAR CONSULTA"
                          className="button-yellow"
                          onClick={() => {
                            modal(
                              setdialogo,
                              "TEM CERTEZA QUE DESEJA DESMARCAR A CONSULTA?",
                              deleteAtendimento,
                              item.id_atendimento
                            );
                          }}
                          style={{ width: 50, height: 50, alignSelf: 'flex-end' }}
                        >
                          <img
                            alt=""
                            src={deletar}
                            style={{
                              margin: 10,
                              height: 30,
                              width: 30,
                            }}
                          ></img>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        <div id="scroll atendimento vazio"
          className='scroll'
          style={{
            display: selectdate == null || arrayatendimentos.filter(item => item.situacao == 3 && moment(item.data_inicio).format('DD/MM/YYYY') == selectdate && item.id_profissional == selectedespecialista.id_usuario).length == 0 ? "flex" : "none",
            flexDirection: 'column',
            justifyContent: "center",
            height: '75vh',
            width: '50vw',
            marginLeft: 20
          }}
        >
          <img
            className='lupa'
            alt=""
            src={lupa}
            style={{
              margin: 10,
              height: 150,
              width: 150,
              opacity: 0.1,
              alignSelf: 'center'
            }}
          ></img>
        </div>
      </div >
    );
    // eslint-disable-next-line
  }, [arrayatendimentos, selectedespecialista, selectdate, viewupdateatendimento]);

  const [listatodosatendimentos, setlistatodosatendimentos] = useState(0);
  const ListaTodosAtendimentos = useCallback(() => {
    return (
      <div
        style={{
          display: listatodosatendimentos == 1 ? 'flex' : 'none',
          flexDirection: "column",
          justifyContent: 'center',
        }}
      >
        <div className='button'
          style={{
            display: window.innerWidth < mobilewidth ? 'none' : 'flex',
            width: 200,
            alignSelf: 'center'
          }}
          onClick={() => {
            setpagina(2);
            history.push("/cadastro");
          }}
        >
          AGENDAR CONSULTA
        </div>
        <div id="scroll atendimentos com pacientes - desktop"
          className='scroll'
          style={{
            display: selectdate != null && arrayatendimentos.filter(item => item.situacao == 3 && moment(item.data_inicio).format('DD/MM/YYYY') == selectdate).length > 0 ? "flex" : "none",
            flexDirection: 'column',
            justifyContent: "flex-start",
            height: '70vh',
            width: window.innerWidth < mobilewidth ? '90vw' : '50vw',
            marginLeft: window.innerWidth < mobilewidth ? 0 : 20,
          }}
        >
          {arrayatendimentos
            .filter(item => item.situacao == 3 && moment(item.data_inicio).format('DD/MM/YYYY') == selectdate)
            .sort((a, b) => (moment(a.data_inicio) > moment(b.data_inicio) ? 1 : -1))
            .map((item) => (
              <div key={"pacientes" + item.id_atendimento}>
                <div
                  style={{
                    display: 'flex', flexDirection: 'row',
                    position: "relative",
                    margin: 2.5, padding: 0,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: -2.5, left: -2.5,
                      padding: 2.5,
                      paddingLeft: 10, paddingRight: 10,
                      borderRadius: 5,
                      backgroundColor: item.faturamento_codigo_procedimento == 'PARTICULAR' ? 'rgb(82, 190, 128, 1)' : '#03aacd',
                      color: 'white',
                      fontWeight: 'bold',
                    }}>
                    {item.faturamento_codigo_procedimento}
                  </div>
                  {ViewUpdateAtendimento(item)}
                  <div
                    id={"btn_todos_atendimentos " + item.id_atendimento}
                    className="button"
                    onClick={() => {
                      setviewupdateatendimento(1);
                    }}
                    style={{
                      marginRight: 0,
                      padding: 10,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                      backgroundColor: '#006666',
                    }}>
                    {moment(item.data_inicio).format('HH:mm') + ' ÀS ' + moment(item.data_termino).format('HH:mm')}
                  </div>
                  <div
                    id={"todos_atendimentos " + item.id_atendimento}
                    className="button"
                    style={{
                      flex: 3,
                      marginLeft: 0,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    }}                    >
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-start",
                          padding: 5,
                          alignSelf: 'center',
                        }}
                      >
                        <div style={{ textAlign: 'left' }}>
                          {pacientes.filter(
                            (valor) => valor.id_paciente == item.id_paciente
                          )
                            .map((valor) => valor.nome_paciente + ', ' + moment().diff(moment(valor.dn_paciente), 'years') + ' ANOS')}
                        </div>
                        <div style={{
                          display: window.innerWidth < mobilewidth ? 'none' : 'flex',
                          textAlign: 'left'
                        }}>
                          {especialistas.filter(valor => valor.id_usuario == item.id_profissional).map(item => 'DR(A). ' + item.nome_usuario + ' - ' + item.conselho + ' ' + item.n_conselho)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div id="btn imprimir guia tiss"
                          title="IMPRIMIR GUIA TISS"
                          className="button-yellow"
                          onClick={() => {
                            setobjpaciente(pacientes.filter(valor => valor.id_paciente == item.id_paciente).pop());
                            setdono_documento(especialistas.filter(valor => valor.id_usuario == item.id_profissional).pop());
                            setTimeout(() => {
                              geraGuiaConsulta();
                            }, 2000);
                          }}
                          style={{
                            display: window.innerWidth < mobilewidth ? 'none' : 'flex',
                            width: 50, height: 50, alignSelf: 'flex-end'
                          }}
                        >
                          <img
                            alt=""
                            src={imprimir}
                            style={{
                              margin: 10,
                              height: 30,
                              width: 30,
                            }}
                          ></img>
                        </div>
                        <div id="btn deletar agendamento de consulta"
                          title="DESMARCAR CONSULTA"
                          className="button-yellow"
                          onClick={() => {
                            modal(
                              setdialogo,
                              "TEM CERTEZA QUE DESEJA DESMARCAR A CONSULTA?",
                              deleteAtendimento,
                              item.id_atendimento
                            );
                          }}
                          style={{
                            width: 50, height: 50, alignSelf: 'flex-end',
                            display: window.innerWidth < mobilewidth ? 'none' : 'flex',
                          }}
                        >
                          <img
                            alt=""
                            src={deletar}
                            style={{
                              margin: 10,
                              height: 30,
                              width: 30,
                            }}
                          ></img>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        <div id="scroll atendimento vazio"
          className='scroll'
          style={{
            display: selectdate == null || arrayatendimentos.filter(item => item.situacao == 3 && moment(item.data_inicio).format('DD/MM/YYYY') == selectdate).length == 0 ? "flex" : "none",
            flexDirection: 'column',
            justifyContent: "center",
            height: '70vh',
            width: window.innerWidth < mobilewidth ? '80vw' : '50vw',
            marginLeft: 20
          }}
        >
          <img
            className='lupa'
            alt=""
            src={lupa}
            style={{
              margin: 10,
              height: 150,
              width: 150,
              opacity: 0.1,
              alignSelf: 'center'
            }}
          ></img>
        </div>
      </div>
    );
    // eslint-disable-next-line
  }, [arrayatendimentos, selectedespecialista, selectdate, viewupdateatendimento]);

  const [viewopcoeshorarios, setviewopcoeshorarios] = useState(0);
  const ViewOpcoesHorarios = () => {
    function TimeComponent() {
      var timeout = null;
      const fixHour = (valor) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          if (valor > 23 || valor < 0) {
            document.getElementById("inputHour").value = '';
            document.getElementById("inputHour").focus();
          } else {
            localStorage.setItem('hora', valor);
          }
        }, 100);
      };
      const fixMin = (valor) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          if (valor > 59 || valor < 0) {
            document.getElementById("inputMin").value = '';
            document.getElementById("inputMin").focus();
          } else {
            localStorage.setItem('min', valor);
          }
        }, 100);
      };
      return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <input
              autoComplete="off"
              className="input"
              placeholder="HH"
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'HH')}
              onKeyUp={(e) => fixHour(e.target.value)}
              title="HORAS."
              maxLength={2}
              style={{
                width: 100,
                height: 50,
              }}
              min={0}
              max={23}
              id="inputHour"
            ></input>
            <div className='text1'>{' : '}</div>
            <input
              autoComplete="off"
              className="input"
              placeholder="MM"
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'MM')}
              onKeyUp={(e) => fixMin(e.target.value)}
              title="MINUTOS."
              maxLength={2}
              style={{
                width: 100,
                height: 50,
              }}
              min={0}
              max={59}
              id="inputMin"
            ></input>
          </div>
          <div id="btnAdd"
            className="button-green"
            title="CONFIRMAR DATA E HORA."
            onClick={() => {
              let hora = localStorage.getItem('hora');
              let min = localStorage.getItem('min');
              // modelo: 'DD/MM/YYYY - HH:mm'
              console.log(selectdate + ' - ' + hora + ':' + min);
              insertAtendimento(selectdate + ' - ' + hora + ':' + min);
              setviewopcoeshorarios(0);
            }}
            style={{ width: 50, maxWidth: 50, alignSelf: 'center', marginTop: 20 }}
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
        </div>
      )
    }
    return (
      <div
        className="fundo"
        style={{ display: viewopcoeshorarios == 1 ? "flex" : "none" }}
        onClick={() => {
          setviewopcoeshorarios(0);
        }}
      >
        <div className="janela"
          style={{
            display: 'flex', flexDirection: 'column', justifyItems: 'flex-start',
            justifyContent: 'flex-start',
            position: 'relative',
            padding: 20,
          }}
          onClick={(e) => e.stopPropagation()}>
          <div className='text1' style={{ marginTop: 0 }}>{'DATA: ' + selectdate + ' - PROFISSIONAL: ' + selectedespecialista.nome_usuario}</div>
          <div className='text1' style={{ fontSize: 18, marginBottom: 0 }}>HORÁRIO DA CONSULTA</div>
          <TimeComponent></TimeComponent>
        </div>
      </div>
    )
  }

  const ViewUpdateAtendimento = (item) => {
    function TimeUpdateComponent() {
      var timeout = null;
      const fixHour = (valor) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          if (valor > 23 || valor < 0) {
            document.getElementById("inputEditHour").value = '';
            document.getElementById("inputEditHour").focus();
          } else {
            localStorage.setItem('hora', valor);
          }
        }, 100);
      };
      const fixMin = (valor) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          if (valor > 59 || valor < 0) {
            document.getElementById("inputEditMin").value = '';
            document.getElementById("inputEditMin").focus();
          } else {
            localStorage.setItem('min', valor);
          }
        }, 100);
      };
      return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          <div id='dia' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <textarea
              autoComplete="off"
              placeholder="DN"
              className="textarea"
              type="text"
              inputMode="numeric"
              maxLength={10}
              id="inputEditDataConsulta"
              title="FORMATO: DD/MM/YYYY"
              onClick={() => document.getElementById("inputEditDataConsulta").value = ""}
              onFocus={(e) => (e.target.placeholder = "")}
              onBlur={(e) => (e.target.placeholder = "DATA")}
              onKeyUp={() => maskdate(timeout, "inputEditDataConsulta")}
              defaultValue={moment(item.data_inicio).format('DD/MM/YYYY')}
              style={{
                flexDirection: "center",
                justifyContent: "center",
                alignSelf: "center",
                width: 100,
                textAlign: "center",
                padding: 15,
                height: 20,
                minHeight: 20,
                maxHeight: 20,
              }}
            ></textarea>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <input
              autoComplete="off"
              className="input"
              placeholder="HH"
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'HH')}
              onKeyUp={(e) => fixHour(e.target.value)}
              title="HORAS."
              maxLength={2}
              style={{
                width: 100,
                height: 50,
              }}
              min={0}
              max={23}
              id="inputEditHour"
            ></input>
            <div className='text1'>{' : '}</div>
            <input
              autoComplete="off"
              className="input"
              placeholder="MM"
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'MM')}
              onKeyUp={(e) => fixMin(e.target.value)}
              title="MINUTOS."
              maxLength={2}
              style={{
                width: 100,
                height: 50,
              }}
              min={0}
              max={59}
              id="inputEditMin"
            ></input>
          </div>
          <div id="btnAdd"
            className="button-green"
            title="CONFIRMAR DATA E HORA."
            onClick={() => {
              let hora = localStorage.getItem('hora');
              let min = localStorage.getItem('min');
              // modelo: 'DD/MM/YYYY - HH:mm'
              console.log(selectdate + ' - ' + hora + ':' + min);
              let nova_data = document.getElementById("inputEditDataConsulta").value;
              let nova_hora = document.getElementById("inputEditHour").value;
              let novo_minuto = document.getElementById("inputEditMin").value;
              updateAtendimento(item, nova_data + ' - ' + nova_hora + ':' + novo_minuto);
              setviewupdateatendimento(0);
            }}
            style={{ width: 50, maxWidth: 50, alignSelf: 'center', marginTop: 20 }}
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
        </div>
      )
    }
    return (
      <div
        className="fundo"
        style={{ display: viewupdateatendimento == 1 ? "flex" : "none" }}
        onClick={() => {
          setviewupdateatendimento(0);
        }}
      >
        <div className="janela"
          style={{
            display: 'flex', flexDirection: 'column', justifyItems: 'flex-start',
            justifyContent: 'flex-start',
            position: 'relative',
            padding: 20,
          }}
          onClick={(e) => e.stopPropagation()}>
          <div className='text1' style={{ fontSize: 18, marginBottom: 0 }}>HORÁRIO DA CONSULTA</div>
          <TimeUpdateComponent></TimeUpdateComponent>
        </div>
      </div>
    )
  }

  if (paciente != null) {
    return (
      <div id="tela de agendamento das consultas"
        className='main'
        style={{ display: pagina == 20 ? 'flex' : 'none', }}
      >
        <div
          className="chassi scroll"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center' }}
          id="conteúdo do agendamento"
        >
          <div style={{ display: 'flex', flexDirection: 'row', width: 'calc(100vw - 20px)', justifyContent: 'flex-start' }}>
            <div id="botão para sair da tela de agendamento"
              className="button-yellow" style={{ maxHeight: 50, maxWidth: 50, alignSelf: 'center' }}
              onClick={() => {
                if (localStorage.getItem('prevScreen') == 'CONSULTA') {
                  setpagina(-2);
                  history.push("/consultas");
                } else {
                  setpagina(0);
                  history.push("/");
                  setpaciente([]);
                }
              }}>
              <img
                alt=""
                src={back}
                style={{ width: 30, height: 30 }}
              ></img>
            </div>
          </div>
          <div
            className='text1'
            style={{ display: listatodosatendimentos == 1 ? 'flex' : 'none', fontSize: 16 }}
          >
            TODAS AS CONSULTAS AGENDADAS
          </div>
          <div
            style={{
              display: listatodosatendimentos == 0 ? 'flex' : 'none',
              flexDirection: 'column', justifyContent: 'flex-start',
              alignItems: 'flex-start', textAlign: 'left', alignSelf: 'flex-start',
              marginTop: 10, marginBottom: 10,
            }}>
            <div className='text2' style={{
              fontSize: 20, justifyContent: 'flex-start', alignSelf: 'flex-start', margin: 0,
              marginTop: 5
            }}>
              {'AGENDAMENTO DE CONSULTA PARA ' + paciente.nome_paciente + ' - DN: ' + moment(paciente.dn_paciente).format('DD/MM/YYYY') + ' (' + moment().diff(moment(paciente.dn_paciente), 'years') + ' ANOS)'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignContent: 'center' }}>
              <div className='text1' style={{ fontSize: 14, margin: 0, alignSelf: 'center' }}>
                {selectedespecialista.nome_usuario == undefined ? 'SELECIONE ABAIXO UM PROFISSIONAL PARA A CONSULTA' : selectedespecialista.tipo_usuario != null ? 'PROFISSIONAL SELECIONADO: ' + selectedespecialista.nome_usuario + ' - ' + selectedespecialista.tipo_usuario : 'PROFISSIONAL SELECIONADO: ' + selectedespecialista.nome_usuario + ' - ESPECIALIDADE NÃO REGISTRADA'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
            <FilterEspecialista></FilterEspecialista>
            <ListaDeEspecialistas></ListaDeEspecialistas>
            <div
              className="fundo"
              style={{ display: viewconsultas == 1 ? "flex" : "none" }}
              onClick={() => { setviewconsultas(0); setselectedespecialista([]) }}
            >
              <div className="janela"
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'relative',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  width: '100%', height: '100%', borderRadius: 0,

                }}
              >
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignSelf: 'center' }}>
                    <div id="botão para sair da lista de agendamentos"
                      className="button-yellow"
                      style={{ maxHeight: 50, maxWidth: 50 }}
                      onClick={() => {
                        setviewconsultas(0);
                        setselectedespecialista([]);
                      }}>
                      <img
                        alt=""
                        src={back}
                        style={{ width: 30, height: 30 }}
                      ></img>
                    </div>
                    <div className='text1' style={{ textAlign: 'left', fontSize: 16 }}>
                      {listatodosatendimentos == 0 ? 'AGENDAMENTO COM PROFISSIONAL: ' + selectedespecialista.nome_usuario + ' (' + selectedespecialista.tipo_usuario + ')' : 'TODOS OS AGENDAMENTOS'}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex', flexDirection: 'row', position: 'relative',
                    marginTop: 15,
                  }}>
                  <DatePicker></DatePicker>
                  <ListaDeAtendimentos></ListaDeAtendimentos>
                </div>
              </div>
            </div>
          </div>
          <ViewOpcoesHorarios></ViewOpcoesHorarios>
          <GuiaConsulta></GuiaConsulta>
        </div>
      </div>
    )
  } else {
    return (
      <div className='main'
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center',
          alignSelf: 'center',
          backgroundColor: 'white',
          borderColor: 'white',
        }}>

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <div id="botão para sair da tela de agendamento"
            className="button-yellow"
            style={{
              maxHeight: 50, maxWidth: 50, alignSelf: 'center'
            }}
            onClick={() => {
              setpagina(0);
              history.push("/");
            }}>
            <img
              alt=""
              src={back}
              style={{ width: 30, height: 30 }}
            ></img>
          </div>
          <div className='text1'
            style={{
              fontSize: window.innerWidth < mobilewidth ? 16 : 22
            }}
          >
            {'CONSULTAS AGENDADAS'}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: window.innerWidth < mobilewidth ? 'column' : 'row',
            justifyContent: window.innerWidth < mobilewidth ? 'flex-start' : 'center',
            marginTop: 20,
            alignContent: 'center',
            alignItems: 'center',
          }}
        >
          <DatePicker></DatePicker>
          <div
            style={{
              display: 'flex',
              flexDirection: window.innerWidth < mobilewidth ? 'column' : 'row',
              backgroundColor: 'white',
              borderColor: 'white',
              borderRadius: 5,
            }}>
            <ListaTodosAtendimentos></ListaTodosAtendimentos>
            <div style={{ display: window.innerWidth < mobilewidth ? 'none' : 'flex' }}>
              <ViewOpcoesHorarios></ViewOpcoesHorarios>
              <GuiaConsulta></GuiaConsulta>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Agendamento;