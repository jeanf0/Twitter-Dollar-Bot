require('dotenv').config();
const twit = require('./twit');
const request = require('request');


const apiLink = "https://economia.awesomeapi.com.br/last/USD-BRL";




let valorAntigo = 0;
const api = () =>{
    request(apiLink, function (e, response, body) {
        let moeda = JSON.parse(body);
        let dolar = {
            value: Number(moeda.USDBRL.bid).toFixed(2),
            pctChange: moeda.USDBRL.pctChange,
            varBid: Number(moeda.USDBRL.varBid).toFixed(2)
        };

        let date = new Date();
        let hours = (Number(date.getHours()));
        let min = date.getMinutes();
        

        switch(hours){
            case 0:
                hours = 21;
                break;
            case 1:
                hours = 22;
                break;
            case 2:
                hours = 23;
                break;
            default:
                hours -= 3;
                break;
        }


        let timeNow = `${hours}:${min}`;
        if(hours <= 9 && min >= 10){
            timeNow = `0${hours}:${min}`;
        } else if(hours >= 10 && min <= 9 ) {
            timeNow = `${hours}:0${min}`;
        } else if(hours <= 9 && min <= 9) {
            timeNow = `0${hours}:0${min}`;
        }


        if(dolar.value != valorAntigo){
            if (dolar.value < valorAntigo) {
                valorAntigo = dolar.value;
                let msg = `Dolar diminuiu 🙂 R$${dolar.value} às ${timeNow}\nVariação de hoje: ${dolar.pctChange}% = R$${dolar.varBid}`;
    
                twit.post('statuses/update', { status: msg }, function(err, data, response) {
                    console.log(data);
                })
                
            } else if (dolar.value > valorAntigo) {
                valorAntigo = dolar.value;
                let msg = `Dolar aumentou ☹️  R$${dolar.value} às ${timeNow}\nVariação de hoje: ${dolar.pctChange}% = R$${dolar.varBid}`;

                twit.post('statuses/update', { status: msg }, function(err, data, response) {
                    console.log(data);
                })
            }
        }
        
    })
}

api();
//const interval = setInterval(api,(20 * 60000) )








