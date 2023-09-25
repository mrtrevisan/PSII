async function healthcheck(){
    var healthcheck = 'https://ufsmgo-gc8z.onrender.com/healthcheck'
    var res = await fetch(healthcheck)
    if (res.status != 200) return false
    else return true
}

async function get_centro(sigla){
    if (!healthcheck) return

    var url = 'https://ufsmgo-gc8z.onrender.com/centro'
    if (sigla == 'all'){
        res = await fetch(url)
        data = await res.json()
        console.log(data)
    } else {
        res = await fetch(url + '/' + sigla)
        data = await res.json()
        console.log(data)
    }
}

async function teste(){
    var data1, data2;

    var url = 'https://ufsmgo.onrender.com/evento'
    res = await fetch(url)
    data1 = await res.json()

    var url2 = 'https://ufsmgo.onrender.com/centro'
    res = await fetch(url2)
    data2 = await res.json()

    data1.forEach(item1 => {
        data2.forEach(item2 =>{
        });     
    });
}

get_centro('ct');