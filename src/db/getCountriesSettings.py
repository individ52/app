
import ijson
import json
import requests
from bs4 import BeautifulSoup

HOST = 'https://en.wikipedia.org/wiki/International_Bank_Account_Number'
WIKI_HOST = "https://en.wikipedia.org"
HEADERS = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)', 'accept': '*/*'}
BASE_PATH = "./src/db"

countryCodes = {}

def saveJson(name, data):
    json_obj = json.dumps(data, indent=4)
    with open(BASE_PATH + "/" + name + ".json", "w") as outfile:
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

# def get_country_code(link):
#     html = get_html(WIKI_HOST + link)
#     algorithms = {}
#     debug = "East_Timor" in link
#     if(html.status_code == 200):
#         soup = BeautifulSoup(html.text, 'html.parser')
#         wholeTables = soup.find_all("table")
#         wholeTable = soup.find_all("table")[0]
#         for table in wholeTables:
#             links = table.select("[href*='ISO_3166-2']")
#             if(len(links) == 1):

#                 return get_text(links[0])
       
    

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
            if(not countryName in countryCodes):
                print(countryName)
                exit()

            countryName = countryCodes[countryName]

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

def get_format():
    html = get_html(HOST)
    algorithms = {}
    if(html.status_code == 200):
        soup = BeautifulSoup(html.text, 'html.parser')
        tables = soup.find_all("table")
        # online_status = get_text(online_block)
        tableAlgorithms = tables[3].find("tbody")
        rows = tableAlgorithms.find_all("tr")
        rows.pop(0)
        for row in rows:
            columns = row.find_all("td")
            countryName = get_text(columns[0].find("a"))
            charsCount = get_text(columns[1])
            bbanFormats = get_text(columns[2]).split(",")
            ibanFields = get_text(columns[3])
            countryCodes[countryName] = ibanFields[0:2]
            commentStr = get_text(columns[4])
            commentParts = commentStr.split("=")
            comments = {}
            for i in range(1, len(commentParts)):
                key = commentParts[i-1][-1]
                value = commentParts[i][0:-1]
                comments[key] = value

            formatData = {
                "chars": tryGetNum(charsCount),
                "bbanFormat": bbanFormats,
                "ibanFields": ibanFields,
                "comments": comments
            }
            algorithms[countryCodes[countryName]] = formatData

        return algorithms

# def convert_country_to_code(algorithms):
#     countryCodes = getJsonData(BASE_PATH + "/country-codes.json", [])
#     def byName(c_name):
#         def f(x):
#             name = c_name.upper()
#             curVal = x["name"].upper()
#             if(name == curVal): return True
#             parts = name.split(" ")
#             ok = False
#             for part in parts:
#                 if(part in curVal): ok = True
#             return ok
#         return f 
#     newAlgorithms = {}
#     for countryName in algorithms:
#         codeData = list(filter(byName(countryName), countryCodes))
#         code = codeData[0]["code"]
#         print(countryName, code)
#         print(code)
#         newAlgorithms[code] = algorithms[countryName] 
    
#     return newAlgorithms

saveJson("country-formats", get_format())
saveJson("country-algorithms", get_algorithms())


