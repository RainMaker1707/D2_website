from tensorflow.keras.models import load_model as load
from tensorflow.keras.preprocessing.sequence import pad_sequences
import numpy as np
import pandas as pd
import ipaddress


protocols = {
            'HTTP': 1, 'HTTPS': 2, 'DNS': 3, 'MTLS': 4, 'TCP': 5, 'TLS': 6, 'TLSv1.3': 7, 'MDNS': 8, 'TLSv1.2': 9, 'QUIC': 10, 
            'UDP': 11, 'ARP': 12, 'SSLv2': 13, 'DCP-PFT': 14, 'SSDP': 15, 'ICMPv6': 16, 'IGMPv3': 17, 'LLMNR': 18, 'TLSv1': 19, 
            'R-GOOSE': 20, 'DHCP': 21, 'OCSP': 22, 'SSL': 23, 'PKIX-CRL': 24, 'ICMP': 25, 'DHCPv6': 26
            }


def ip_to_int(col):
    ip_list = list()
    for ip in col:
        if ip is None: ip_list.append(-1)
        else:
            try:
                ip_list.append(int(ipaddress.IPv4Address(ip)))
            except:
                try:
                    ip_list.append(int(ipaddress.IPv6Address(ip)))
                except:
                    ip_list.append(0)    
    return pd.Series(data=ip_list)


def protocol_to_int(col):
    protocol_list = list()
    for protocol in col:
        if protocol not in protocols:
            protocols[protocol] = len(protocols)+1
        protocol_list.append(protocols.get(protocol))
    return pd.Series(data=protocol_list)


def preprocess(file_path):
    file = pd.read_csv(file_path)
    file.drop(["No.", "Time", "Info"], axis='columns', inplace=True)
    file["Source"] = ip_to_int(file["Source"])
    file["Destination"] = ip_to_int(file["Destination"])
    file["Protocol"] = protocol_to_int(file["Protocol"])
    padded_x = pad_sequences([file], maxlen=56915, padding='post', dtype='float32')
    return padded_x

def config(model_path):
    model = load(model_path)
    return model

def fullchain(model_path, file_path):
    model = config(model_path)
    data = preprocess(file_path)
    if len(data)>0:
        return f'{model.predict(data)[0][0]*100: .2f}'
    else:
        return 10.0