
import ijson
import json
import requests
from bs4 import BeautifulSoup

HOST = 'https://en.wikipedia.org/wiki/International_Bank_Account_Number'
HEADERS = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)', 'accept': '*/*'}
BASE_PATH = "./src/db"

def saveAlgorithms(data):
    json_obj = json.dumps(data, indent=4)
    with open(BASE_PATH + "/country-algorithms.json", "w") as outfile:
        outfile.write(json_obj)

def get_html(url, params=None):
    r = requests.get(url, headers=HEADERS, params=params)
    return r

def get_text(elem):
    return elem.get_text(strip=True)

def getJsonData(path, defaultObj):
    try:
        data_to_repos = defaultObj
        
        with open(path, "rb") as f:
            for record in ijson.items(f, "item"):
                data_to_repos.append(record)
            
            f.close()

        return data_to_repos
    except:
        return defaultObj

def tryGetNum(num):
    num = num.strip()
    try:
        return int(num)
    except:
        return num

def get_algorithms():
    html = get_html(HOST)
    algorithms = {}
    if(html.status_code == 200):
        soup = BeautifulSoup(html.text, 'html.parser')
        tables = soup.find_all("table")
        # online_status = get_text(online_block)
        tableAlgorithms = tables[2].find("tbody")
        rows = tableAlgorithms.find_all("tr")
        rows.pop(0)
        for row in rows:
            columns = row.find_all("td")
            countryName = get_text(columns[0].find("a"))
            algorithmName = get_text(columns[1])
            weightsStr = get_text(columns[2])
            weightsStrs = weightsStr.split(",")
            if(weightsStrs[0] != ""):
                weights = [int(numeric_string) for numeric_string in weightsStrs]
            else: weights = []
            modulesStr = get_text(columns[3])
            modulesStrs = modulesStr.split(",")
            if(modulesStrs[0] != ""):
                modules = [int(numeric_string) for numeric_string in modulesStrs]
            else: modules = []
            complementStr = get_text(columns[4])
            complementParts = complementStr.split(",")
            complements = []
            rangeMark = "−"
            replaceMark = "→"
            for complement in complementParts:
                if(complement == "r"):
                    complements.append({
                        "type": "range",
                        "from": "r",
                        "to": "r"
                    })
                elif(rangeMark in complement):
                    parts = complement.split(rangeMark)
                    complements.append({
                        "type": "range",
                        "from": tryGetNum(parts[0]),
                        "to": tryGetNum(parts[1])
                    })
                elif(replaceMark in complement):
                    parts = complement.split(replaceMark)
                    complements.append({
                        "type": "replace",
                        "from": tryGetNum(parts[0]),
                        "to": tryGetNum(parts[1])
                    })

            algorithms[countryName] = {
                "algorithm": algorithmName,
                "weights": weights,
                "modulo": modules,
                "complements": complements
            }


        return algorithms

def convert_country_to_code(algorithms):
    countryCodes = getJsonData(BASE_PATH + "/country-codes.json", [])
    def byName(c_name):
        def f(x):
            parts = c_name.upper().split(" ")
            curVal = x["name"].upper()
            ok = False
            for part in parts:
                if(part in curVal): ok = True
            return ok
        return f 
    newAlgorithms = {}
    for countryName in algorithms:
        codeData = list(filter(byName(countryName), countryCodes))
        code = codeData[0]["code"]
        newAlgorithms[code] = algorithms[countryName] 
    
    return newAlgorithms

algorithms = get_algorithms()
algorithms = convert_country_to_code(algorithms)
saveAlgorithms(algorithms)



print(algorithms)