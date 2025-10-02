import yfinance as yf

def fetch_coin_data(coin: str, period="7d", interval="1h"):
    """
    Fetch crypto price data from Yahoo Finance.
    """
    return yf.download(tickers=coin, period=period, interval=interval)
