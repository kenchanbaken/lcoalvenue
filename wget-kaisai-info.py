import argparse
import requests
# python wget.py 202305
parser = argparse.ArgumentParser(description='Download horse racing data from Keiba website')
parser.add_argument('yyyymm', type=str, help='target year and month in yyyymm format')
args = parser.parse_args()

# parse year and month from input string
year = int(args.yyyymm[:4])
month = int(args.yyyymm[4:])

# create target URL
url = f'https://www.keiba.go.jp/KeibaWeb/MonthlyConveneInfo/MonthlyConveneInfoTop?k_year={year}&k_month={month}'

# download and save html file
response = requests.get(url)
filename = f'{args.yyyymm}.html'
with open(filename, 'wb') as f:
    f.write(response.content)

print(f'Successfully downloaded {url} to {filename}')