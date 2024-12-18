/* eslint eqeqeq: "off" */

import React, { useContext } from 'react';
import Context from '../pages/Context';
import moment from "moment";
import { QRCodeSVG } from 'qrcode.react';

function Header() {

  const {
    cliente,
    atendimento, // corresponde ao id_atendimento das tabela "atendimento".
    objatendimento, // todos os parâmetros do objeto atendimento.
    selecteddocumento,
    alergias,
  } = useContext(Context);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignSelf: 'center',
      fontFamily: 'Helvetica',
      breakInside: 'avoid',
      width: '100%',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          <img
            alt=""
            src={cliente.logo}
            style={{
              margin: 0, marginBottom: 10,
              width: 150,
            }}
          ></img>
          <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', fontSize: 10,
            marginRight: 50,
            width: '100%',
          }}>
            <div style={{ fontSize: 10 }}>{cliente.razao_social}</div>
            <div style={{ fontSize: 10 }}>{'ENDEREÇO: ' + cliente.endereco}</div>
            <div style={{ fontSize: 10 }}>{'TELEFONE: ' + cliente.telefone}</div>
            <div style={{ fontSize: 10 }}>{'EMAIL: ' + cliente.email}</div>
          </div>
        </div>
        <div
          style={{
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between',
            alignContent: 'center',
            alignItems: 'center',
            borderRadius: 5, backgroundColor: '#d5d8dc',
            color: 'black', fontSize: 10, fontWeight: 'bold',
            padding: 5,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div>{moment(selecteddocumento.data).format('DD/MM/YY - HH:mm')}</div>
            <div style={{ marginBottom: 5 }}>{'ATENDIMENTO: ' + atendimento}</div>
          </div>
          <QRCodeSVG style={{ height: 100, width: 100, margin: 5 }} value={cliente.qrcode} />
        </div>
      </div>
      <div style={{ fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: 20, marginTop: 10 }}>
        {objatendimento != undefined ? 'CLIENTE: ' + objatendimento.nome_paciente : ''}
      </div>
      <div
        style={{
          display: alergias.length > 0 ? 'flex' : 'none',
          fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: 16, marginTop: 10, color: 'red', textDecoration: 'underline'
        }}>
        {'ALERGIAS: ' + alergias.map(item => ' ' + item.alergia + ' ')}
      </div>
      <hr style={{ display: 'flex', border: '1px solid black', width: '100%' }}></hr>
    </div>
  )
}

export default Header;
