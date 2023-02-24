const console = require("console");
const fs = require("fs");
const http = require("http");
var requests = require("requests")
const HomeFile = fs.readFileSync("home.html", "utf-8")

const replaceVal = (tempval, orignal) => {
    let temperature = tempval.replace("{%tempval%}", orignal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orignal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orignal.main.temp_max);
    temperature = temperature.replace("{%location%}", orignal.name);
    temperature = temperature.replace("{%location2%}", orignal.name);
    temperature = temperature.replace("{%Clearsky%}", orignal.weather[0].description);
    temperature = temperature.replace("{%Country%}", orignal.sys.country);
    c = new Date(orignal.sys.sunrise).toLocaleTimeString();
    temperature = temperature.replace("{%Sunrise%}", c);
    temperature = temperature.replace("{%Sunset%}", Date(orignal.sys.sunset));
    temperature = temperature.replace("{%humidity%}", orignal.main.humidity);
    temperature = temperature.replace("{%wind%}", orignal.wind.speed);
    temperature = temperature.replace("{%pressure%}", orignal.main.pressure);
    temperature = temperature.replace("{%cloudsm%}", orignal.weather[0].main);
    temperature = temperature.replace("{%temStatus%}", orignal.weather[0].main);


    return temperature
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Rawalpindi&appid=dd11085239de9d6ccb581f97167332d2")
            .on("data", (chunk) => {
                const obj = JSON.parse(chunk)
                const arry = [obj]
                // console.log(arry[0].main.temp);
                const realtime = arry.map((val) => replaceVal(HomeFile, val))
                    .join("");
                res.write(realtime);

                // console.log(realtime)
                // console.log(arry)
            })
            .on("end", (err) => {
                console.log(err)
                res.end();
            })
    }
})

server.listen("8000", "127.0.0.1", () => {
})