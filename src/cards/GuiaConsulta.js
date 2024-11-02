/* eslint eqeqeq: "off" */
import React, { useContext, useState, useEffect } from 'react';
import Context from '../pages/Context';
import moment from "moment";
// imagens.
import back from '../images/back.svg';
import imprimir from '../images/imprimir.svg';

function GuiaConsulta() {

  // context.
  const {
    card,
    cliente,
    objpaciente,
    operadoras,
    dono_documento,
  } = useContext(Context);

  let operadora = [];
  useEffect(() => {
    console.log('GUIA CONSULTA CARREGADA');
    if (card == 'guia-consulta') {
      setn_carteira(objpaciente.convenio_carteira);
      setvalidade_carteira(objpaciente.validade_carteira);
      setnome(objpaciente.nome_paciente);
      setcns(objpaciente.cns);
      console.log(dono_documento);

      console.log(operadoras);
      // eslint-disable-next-line
      operadora = operadoras.filter(valor => valor.id == objpaciente.convenio_codigo).pop();
      console.log(objpaciente.convenio_codigo);
      console.log(operadoras);

      setlogo(operadora.logo_operadora);
      setregistro_ans(operadora.registro_ans);
      setcodigo_prestador(operadora.codigo_prestador);

      setnome_contratado(cliente.nome_cliente);
      setnome_solicitante(dono_documento.nome_usuario);
      setconselho_solicitante(dono_documento.conselho);
      setn_conselho_solicitante(dono_documento.n_conselho);
      setuf_solicitante('MG');
      setcodigo_cbo(dono_documento.codigo_cbo);

      settipoconsulta(localStorage.getItem('tipo_consulta'));
      console.log(dono_documento);
      console.log(cliente);
    }
    // eslint-disable-next-line
  }, [card, objpaciente, operadora, dono_documento]);

  const [logo, setlogo] = useState();

  // campos da guia TISS-CONSULTA.
  const [guia_prestador, setguia_prestador] = useState('');
  const [registro_ans, setregistro_ans] = useState('');

  const [n_carteira, setn_carteira] = useState('');
  const [validade_carteira, setvalidade_carteira] = useState('');
  const [rn, setrn] = useState('NÃO');
  const [nome, setnome] = useState('');
  const [cns, setcns] = useState('');

  const [codigo_prestador, setcodigo_prestador] = useState('');
  const [nome_contratado, setnome_contratado] = useState('');
  // código CNES

  const [nome_solicitante, setnome_solicitante] = useState('');
  const [conselho_solicitante, setconselho_solicitante] = useState('');
  const [n_conselho_solicitante, setn_conselho_solicitante] = useState('');
  const [uf_solicitante, setuf_solicitante] = useState('');
  const [codigo_cbo, setcodigo_cbo] = useState('');

  const [data_atendimento, setdata_atendimento] = useState(moment().format('DD/MM/YYYY'));
  const [tipoconsulta, settipoconsulta] = useState('');
  const [tabela, settabela] = useState('04'); // consulta - obtido da tabela de domínio 50.
  const [codigo_procedimento, setcodigo_procedimento] = useState('?');
  const [valor_procedimento, setvalor_procedimento] = useState('R$ 300');

  // campos para edição da guia.
  let timeout = null;
  const editcampo = (titulo, valor, setvalor, tamanho, grow) => {
    return (
      <div id="versão para edição"
        style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
          position: 'relative',
          borderStyle: 'solid', borderWidth: 1, borderColor: 'black', borderRadius: 2.5,
          margin: 2, padding: 5,
          width: grow == 1 ? '' : tamanho,
          flexGrow: grow,
          minHeight: 20, maxHeight: 20,
          fontSize: 10, textAlign: 'left',
        }}>
        <div style={{
          position: 'absolute', top: -5, left: 5,
          backgroundColor: 'white',
          fontSize: 7,
          minHeight: 15, maxHeight: 15,
          paddingLeft: 2.5, paddingRight: 2.5,
        }}>
          {titulo}
        </div>
        <input
          id={'input ' + titulo}
          className='tiss_textarea'
          autoComplete="off"
          placeholder={titulo}
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = { titulo })}
          // defaultValue={valor.length > 55 ? valor.toUpperCase().slice(0, 55) + '...' : valor.toUpperCase()}
          defaultValue={valor != null && valor.length > 50 ? valor.toUpperCase().slice(0, 55) + '...' : valor != null && valor.length < 51 ? valor.toUpperCase() : ''}
          style={{ backgroundColor: 'transparent', margin: 0, marginTop: 2, marginLeft: -2.5, padding: 0 }}
          onKeyUp={() => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              console.log(valor.toString())
              setvalor(document.getElementById('input ' + titulo).value);
            }, 2000);
          }}
        >
        </input>
      </div>
    )
  }
  const editcampovalor = (titulo, valor, tamanho, grow) => {
    return (
      <div id="versão para edição"
        style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
          position: 'relative',
          borderStyle: 'solid', borderWidth: 1, borderColor: 'black', borderRadius: 2.5,
          margin: 2, padding: 5,
          width: grow == 1 ? '' : tamanho,
          flexGrow: grow,
          minHeight: 20, maxHeight: 20,
          fontSize: 10, textAlign: 'left',
        }}>
        <div style={{
          position: 'absolute', top: -5, left: 5,
          backgroundColor: 'white',
          fontSize: 7,
          minHeight: 15, maxHeight: 15,
          paddingLeft: 2.5, paddingRight: 2.5,
        }}>
          {titulo}
        </div>
        <input
          id={'input ' + titulo}
          className='tiss_textarea'
          autoComplete="off"
          placeholder={titulo}
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = { titulo })}
          defaultValue={valor != null && valor.length > 55 ? valor.toUpperCase().slice(0, 55) + '...' : valor}
          style={{ backgroundColor: 'transparent', margin: 0, marginTop: 2, marginLeft: -2.5, padding: 0 }}
        >
        </input>
      </div>
    )
  }

  // campo para impressão da guia.
  const pdfcampo = (titulo, valor, flex) => {
    return (
      <div id="versão para impressão" className='noprint'
        style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
          position: 'relative',
          borderStyle: 'solid', borderWidth: 1, borderColor: 'black', borderRadius: 2.5,
          margin: 1, marginTop: 5,
          padding: 1.5,
          flex: flex,
          minHeight: 15, maxHeight: 15,
          fontSize: 8, textAlign: 'left',
          fontFamily: 'Helvetica'
        }}>
        <div style={{
          position: 'absolute', top: -6, left: 5,
          backgroundColor: 'white',
          fontSize: 7,
          minHeight: 10, maxHeight: 10,
          paddingLeft: 2.5, paddingRight: 2.5,
          fontFamily: 'Helvetica'
        }}>
          {titulo}
        </div>
        <div style={{
          paddingTop: 5,
          fontFamily: 'Helvetica'
        }}>
          {valor != null && valor.length > 50 ? valor.toUpperCase().slice(0, 55) + '...' : valor != null && valor.length < 51 ? valor.toUpperCase() : ''}
        </div>
      </div>
    )
  }

  // IMPRESSÃO DA GUIA DE CONSULTA.
  function printDiv() {
    let printdocument = document.getElementById("GUIA CONSULTA PRINT").innerHTML;
    var a = window.open();
    a.document.write('<html>');
    a.document.write('<link rel="stylesheet" type="text/css" href="design.css"></link>');
    a.document.write(printdocument);
    a.document.write('</html>');
    a.print();
  }

  if (operadora != null) {
    return (
      <div id="guia-consulta"
        className='card-aberto'
        style={{ display: 'none', visibility: 'hidden' }}
      >
        <div className="text3">GUIA CONSULTA</div>
        < div className="fundo"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="janela scroll"
            style={{
              width: '80vw', height: '70vh',
              padding: 20, paddinRight: 30,
              backgroundColor: 'white', borderColor: 'white',
              flexDirection: 'column', justifyContent: 'flex-start',
              overflowX: 'scroll', overflowY: 'scroll',
            }}>
            <div id="botões da guia"
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignSelf: 'flex-end',
                paddingRight: 20,
              }}>
              <div
                id="botão de retorno"
                className="button-red"
                style={{
                  display: 'flex',
                  opacity: 1,
                  backgroundColor: "#ec7063",
                  alignSelf: "center",
                }}
                onClick={() => {
                  document.getElementById("guia-consulta").style.display = 'none';
                  document.getElementById("guia-consulta").style.visibility = 'hidden';
                }}
              >
                <img alt="" src={back} style={{ width: 30, height: 30 }}></img>
              </div>
              <div
                id="botão de impressão"
                className="button-red"
                style={{
                  display: 'flex',
                  opacity: 1,
                  backgroundColor: "#ec7063",
                  alignSelf: "center",
                }}
                onClick={() => {
                  printDiv();
                }}
              >
                <img alt="" src={imprimir} style={{ width: 30, height: 30 }}></img>
              </div>
            </div>
            <div id="GUIA CONSULTA EDIT"
              className='noprint'
              style={{
                display: 'flex', flexDirection: 'column', width: 'calc(100% - 20px)',
                justifyContent: 'flex-start', marginTop: 25
              }}>
              <div id="cabeçalho" style={{
                display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
                height: 100, alignContent: 'center',
                alignItems: 'center',
              }}>
                <img alt="" src={logo} style={{ width: 100, height: 100 }}></img>
                <div style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', width: 500 }}>
                  {'GUIA DE CONSULTA'}
                </div>
                {editcampo('2 - Nº DA GUIA DO PRESTADOR', guia_prestador, setguia_prestador, 120, 0)}
              </div>
              <div id='linha comum da guia' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                {editcampo('1- REGISTRO ANS', registro_ans, setregistro_ans, 100, 0)}
                {editcampovalor('3 - NÚMERO DA GUIA PRINCIPAL', '', '', 0)}
              </div>
              <div className='grupo'>{'DADOS DO BENEFICIÁRIO'}</div>
              <div id='linha comum da guia' style={{ display: 'flex', flexDirection: 'row' }}>
                {editcampo('4 - Nº DA CARTEIRA', n_carteira, setn_carteira, 100, 0)}
                {editcampo('5 - VALIDADE DA CARTEIRA', validade_carteira, setvalidade_carteira, 70, 0)}
                {editcampo('6 - ATENDIMENTO A RN', rn, setrn, 90, 0)}

                {editcampo('7 - NOME', nome, setnome, '', 1)}
                {editcampo('8 - CARTÃO NACIONAL DE SAÚDE', cns, setcns, 90, 0)}
              </div>
              <div className='grupo'>{'DADOS DO CONTRATADO'}</div>
              <div id='linha comum da guia' style={{ display: 'flex', flexDirection: 'row' }}>
                {editcampo('9 - CÓDIGO NA OPERADORA', codigo_prestador, setcodigo_prestador, 200, 0)}
                {editcampo('10 - NOME DO CONTRATADO', nome_contratado, setnome_contratado, '', 1)}
                {editcampo('11 - CÓDIGO CNES', cliente.cnes, setcodigo_cbo, 200, 0)}
              </div>
              <div id='linha comum da guia' style={{ display: 'flex', flexDirection: 'row' }}>
                {editcampo('12 - NOME DO PROFISSIONAL EXECUTANTE', nome_solicitante, setnome_solicitante, '', 1)}
                {editcampo('13 - CONSELHO PROFISSIONAL', conselho_solicitante, setconselho_solicitante, 100, 0)}
                {editcampo('14 - NÚMERO NO CONSELHO', n_conselho_solicitante, setn_conselho_solicitante, 150, 0)}
                {editcampo('15 - UF', uf_solicitante, setuf_solicitante, 100, 0)}
                {editcampo('16 - CÓDIGO CBO', codigo_cbo, setcodigo_cbo, 100, 0)}
              </div>
              <div className='grupo'>{'DADOS DO ATENDIMENTO / PROCEDIMENTO  REALIZADO'}</div>
              {editcampovalor('17 - INDICAÇÃO DE ACIDENTE (ACIDENTE OU DOENÇA RELACIONADA)', '9', 200, 0)}
              <div id='linha comum da guia' style={{ display: 'flex', flexDirection: 'row' }}>
                {editcampo('18 - DATA DO ATENDIMENTO', data_atendimento, setdata_atendimento, 250, 0)}
                {editcampo('19 - TIPO DE CONSULTA', tipoconsulta, settipoconsulta, 50, 0)}
                {editcampo('20 - TABELA', tabela, settabela, 200, 0)}
                {editcampo('21 - CÓDIGO DO PROCEDIMENTO', codigo_procedimento, setcodigo_procedimento, 300, 0)}
                {editcampo('22 - VALOR DO PROCEDIMENTO', valor_procedimento, setvalor_procedimento, 300, 0)}
              </div>
              <div className='fonte_titulo_header' style={{
                display: 'flex', flexDirection: 'row',
                height: 50, backgroundColor: '#B2BEBE',
                position: 'relative', width: '100%',
                borderRadius: 2.5,
                marginTop: 5, marginBottom: 5,
              }}>
                <div style={{ position: 'absolute', top: 5, left: 5 }}>
                  {'23 - OBSERVAÇÃO/JUSTIFICATIVA'}
                </div>
              </div>
              <div
                style={{
                  display: 'flex', flexDirection: 'column',
                  borderStyle: 'solid',
                  borderColor: 'black',
                  borderWidth: 1,
                  borderRadius: 2.5,
                  padding: 5,
                  margin: 5,
                }}
              >
                <div id='cabeçalho do grupo'
                  style={{
                    display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  <div className='fonte_titulo_header' style={{ minWidth: 200, maxWidth: 200 }}>
                    {'24 - ASSINATURA DO PROFISSIONAL EXECUTANTE'}
                  </div>
                  <div className='fonte_titulo_header' style={{ minWidth: 200, maxWidth: 200 }}>
                    {'25 - ASSINATURA DO BENEFICIÁRIO OU RESPONSÁVEL'}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <div className='fonte_titulo_header' style={{ minWidth: 200, width: 200 }}>{'____________________________'}</div>
                  <div className='fonte_titulo_header' style={{ minWidth: 200, width: 200 }}>{'____________________________'}</div>
                </div>
              </div>
            </div>

            <div id="GUIA CONSULTA PRINT"
              className='print'
              style={{
                display: 'flex', flexDirection: 'column', width: 'calc(100% - 20px)',
                justifyContent: 'flex-start', marginTop: 25
              }}>
              <div id="cabeçalho" style={{
                display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
                height: 100, alignContent: 'center',
                alignItems: 'center',
              }}>
                <img alt="" src={logo} style={{ width: 100, height: 100 }}></img>
                <div style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', width: 500 }}>
                  {'GUIA DE CONSULTA'}
                </div>
                {pdfcampo('2 - Nº DA GUIA DO PRESTADOR', guia_prestador, 1)}
              </div>
              <div id='linha comum da guia' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                {pdfcampo('1- REGISTRO ANS', registro_ans, 1)}
                {pdfcampo('3 - NÚMERO DA GUIA PRINCIPAL', '', 1)}
              </div>
              <div className='grupo'
                style={{
                  fontFamily: 'Helvetica', fontSize: 8,
                  backgroundColor: '#B2BEBE',
                  borderRadius: 2.5,
                  padding: 1,
                  margin: 1
                }}
              >{'DADOS DO BENEFICIÁRIO'}
              </div>
              <div id='linha comum da guia' style={{ display: 'flex', flexDirection: 'row' }}>
                {pdfcampo('4 - Nº DA CARTEIRA', n_carteira, 3)}
                {pdfcampo('5 - VALIDADE DA CARTEIRA', validade_carteira, 2)}
                {pdfcampo('6 - ATENDIMENTO A RN', rn, 1)}
              </div>
              <div id='linha comum da guia' style={{ display: 'flex', flexDirection: 'row' }}>
                {pdfcampo('7 - NOME', nome, 4)}
                {pdfcampo('8 - CARTÃO NACIONAL DE SAÚDE', cns, 1)}
              </div>
              <div className='grupo'
                style={{
                  fontFamily: 'Helvetica', fontSize: 8,
                  backgroundColor: '#B2BEBE',
                  borderRadius: 2.5,
                  padding: 1,
                  margin: 1
                }}
              >
                {'DADOS DO CONTRATADO'}
              </div>
              <div id='linha comum da guia' style={{ display: 'flex', flexDirection: 'row' }}>
                {pdfcampo('9 - CÓDIGO NA OPERADORA', codigo_prestador, 2)}
                {pdfcampo('10 - NOME DO CONTRATADO', nome_contratado, 4)}
                {pdfcampo('11 - CÓDIGO CNES', cliente.cnes, 2)}
              </div>
              <div id='linha comum da guia' style={{ display: 'flex', flexDirection: 'row' }}>
                {pdfcampo('12 - NOME DO PROFISSIONAL EXECUTANTE', nome_solicitante, 5)}
                {pdfcampo('13 - CONSELHO PROFISSIONAL', conselho_solicitante, 3)}
                {pdfcampo('14 - NÚMERO NO CONSELHO', n_conselho_solicitante, 3)}
                {pdfcampo('15 - UF', uf_solicitante, 1)}
                {pdfcampo('16 - CÓDIGO CBO', codigo_cbo, 3)}
              </div>

              <div className='grupo'
                style={{
                  fontFamily: 'Helvetica', fontSize: 8,
                  backgroundColor: '#B2BEBE',
                  borderRadius: 2.5,
                  padding: 1,
                  margin: 1
                }}
              >
                {'DADOS DO ATENDIMENTO / PROCEDIMENTO  REALIZADO'}
              </div>
              <div id='linha comum da guia' style={{ display: 'flex', flexDirection: 'row', width: 300 }}>
                {pdfcampo('17 - INDICAÇÃO DE ACIDENTE (ACIDENTE OU DOENÇA RELACIONADA)', '9', 1)}
              </div>
              <div id='linha comum da guia' style={{ display: 'flex', flexDirection: 'row' }}>
                {pdfcampo('18 - DATA DO ATENDIMENTO', data_atendimento, 1)}
                {pdfcampo('19 - TIPO DE CONSULTA', tipoconsulta, 1)}
                {pdfcampo('20 - TABELA', tabela, 1)}
                {pdfcampo('21 - CÓDIGO DO PROCEDIMENTO', codigo_procedimento, 1)}
                {pdfcampo('22 - VALOR DO PROCEDIMENTO', valor_procedimento, 1)}
              </div>

              <div className='fonte_titulo_header' style={{
                display: 'flex', flexDirection: 'row',
                height: 50, backgroundColor: '#B2BEBE',
                position: 'relative', width: '100%',
                borderRadius: 2.5,
                marginTop: 5, marginBottom: 5,
              }}>
                <div style={{ position: 'absolute', top: 5, left: 5, fontFamily: 'Helvetica', fontSize: 8 }}>
                  {'23 - OBSERVAÇÃO/JUSTIFICATIVA'}
                </div>
              </div>
              <div
                style={{
                  display: 'flex', flexDirection: 'column',
                  borderStyle: 'solid',
                  borderColor: 'black',
                  borderWidth: 1,
                  borderRadius: 2.5,
                  padding: 5,
                  margin: 5,
                }}
              >
                <div id='cabeçalho do grupo'
                  style={{
                    display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  <div className='fonte_titulo_header'
                    style={{
                      minWidth: 300, maxWidth: 300,
                      fontFamily: 'Helvetica',
                      fontSize: 8,
                    }}>
                    {'24 - ASSINATURA DO PROFISSIONAL EXECUTANTE'}
                  </div>
                  <div className='fonte_titulo_header'
                    style={{
                      minWidth: 300, maxWidth: 300,
                      fontFamily: 'Helvetica',
                      fontSize: 8,
                    }}
                  >
                    {'25 - ASSINATURA DO BENEFICIÁRIO OU RESPONSÁVEL'}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <div className='fonte_titulo_header' style={{ minWidth: 300, width: 300 }}>{'____________________________'}</div>
                  <div className='fonte_titulo_header' style={{ minWidth: 300, width: 300 }}>{'____________________________'}</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div >
    )
  } else {
    return (
      <div id="guia-consulta"
        className='card-aberto'
        style={{ display: 'none', visibility: 'hidden' }}
      >
        < div className="fundo"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 }}>
          <div className="janela">PREPARANDO GUIA...</div>
        </div>
      </div>
    )
  }
}

/*
const stock = () => {
  return (
    <div>
      <div id='linha comum da guia' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
        {pdfcampo('1- REGISTRO ANS', registro_ans, 2)}
        {editcampovalor('3 - NÚMERO DA GUIA PRINCIPAL', 2)}
      </div>
      <div className='grupo'>{'DADOS DO BENEFICIÁRIO'}</div>
      <div id='linha comum da guia' style={{ display: 'flex', flexDirection: 'row' }}>
        {pdfcampo('4 - Nº DA CARTEIRA', n_carteira, 3)}
        {pdfcampo('5 - VALIDADE DA CARTEIRA', validade_carteira, 2)}
        {pdfcampo('6 - ATENDIMENTO A RN', rn, 1)}

        {pdfcampo('7 - NOME', nome, 5)}
        {pdfcampo('8 - CARTÃO NACIONAL DE SAÚDE', cns, 2)}
      </div>
      <div className='grupo'>{'DADOS DO CONTRATADO'}</div>
      <div id='linha comum da guia' style={{ display: 'flex', flexDirection: 'row' }}>
        {pdfcampo('9 - CÓDIGO NA OPERADORA', codigo_prestador, 2)}
        {pdfcampo('10 - NOME DO CONTRATADO', nome_contratado, 5)}
        {pdfcampo('11 - CÓDIGO CNES', cliente.cnes, 2)}
      </div>
      <div id='linha comum da guia' style={{ display: 'flex', flexDirection: 'row' }}>
        {pdfcampo('12 - NOME DO PROFISSIONAL EXECUTANTE', nome_solicitante, 6)}
        {pdfcampo('13 - CONSELHO PROFISSIONAL', conselho_solicitante, 3)}
        {pdfcampo('14 - NÚMERO NO CONSELHO', n_conselho_solicitante, 3)}
        {pdfcampo('15 - UF', uf_solicitante, 1)}
        {pdfcampo('16 - CÓDIGO CBO', codigo_cbo, 2)}
      </div>
      <div className='grupo'>{'DADOS DO ATENDIMENTO / PROCEDIMENTO  REALIZADO'}</div>
      <div style={{ witdh: 300 }}>
        {pdfcampo('17 - INDICAÇÃO DE ACIDENTE (ACIDENTE OU DOENÇA RELACIONADA)', '9', 1)}
      </div>
      <div id='linha comum da guia' style={{ display: 'flex', flexDirection: 'row' }}>
        {pdfcampo('18 - DATA DO ATENDIMENTO', data_atendimento, 2)}
        {pdfcampo('19 - TIPO DE CONSULTA', tipoconsulta, 1)}
        {pdfcampo('20 - TABELA', tabela, 1)}
        {pdfcampo('21 - CÓDIGO DO PROCEDIMENTO', codigo_procedimento, 2)}
        {pdfcampo('22 - VALOR DO PROCEDIMENTO', valor_procedimento, 2)}
      </div>
    </div>
  )
}
*/

export default GuiaConsulta;
