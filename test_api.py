#!/usr/bin/env python3
import requests
import json

def test_binance_api():
    base_url = "https://fapi.binance.com"
    
    # Test funding rates with different symbols
    symbols_to_test = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "ADAUSDT", "SUIUSDT"]
    
    for symbol in symbols_to_test:
        print(f"\nTesting {symbol}...")
        url = f"{base_url}/fapi/v1/fundingRate"
        params = {'symbol': symbol, 'limit': 1}
        
        try:
            response = requests.get(url, params=params)
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"Data: {data}")
            else:
                print(f"Error: {response.text}")
        except Exception as e:
            print(f"Exception: {e}")
    
    # Test exchange info to see available symbols
    print("\n\nTesting exchange info...")
    try:
        response = requests.get(f"{base_url}/fapi/v1/exchangeInfo")
        if response.status_code == 200:
            data = response.json()
            symbols = [s['symbol'] for s in data['symbols'] if s['status'] == 'TRADING']
            print(f"Total trading symbols: {len(symbols)}")
            print("First 10 symbols:", symbols[:10])
            
            # Check if SUIUSDT exists
            if 'SUIUSDT' in symbols:
                print("SUIUSDT is available")
            else:
                print("SUIUSDT is NOT available")
                sui_symbols = [s for s in symbols if 'SUI' in s]
                print(f"SUI-related symbols: {sui_symbols}")
        else:
            print(f"Error getting exchange info: {response.status_code}")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_binance_api()