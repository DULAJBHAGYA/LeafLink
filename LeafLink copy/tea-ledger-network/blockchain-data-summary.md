# 📊 Tea Ledger Network - Blockchain Data Summary

## 🎯 Overview

This document provides a complete overview of all data stored on your Hyperledger Fabric tea supply chain blockchain.

## 📈 Entity Statistics

### **Total Entities on Blockchain:**

- 🌱 **Farmers**: 5 registered
- 🚚 **Transporters**: 4 registered
- 🛒 **Buyers**: 5 registered
- 🍃 **Tea Batches**: 3 created
- **📊 Total**: 17 entities

---

## 🌱 FARMERS

| ID      | Name                  | Location     | Registration Date   |
| ------- | --------------------- | ------------ | ------------------- |
| FARM001 | GreenField Farms      | Nuwara Eliya | 2025-07-20 09:59:19 |
| FARM006 | TestFarmer6           | Location6    | 2025-07-20 10:32:04 |
| FARM007 | Highland Tea Gardens  | Kandy        | 2025-07-20 10:36:25 |
| FARM008 | Mountain View Estates | Badulla      | 2025-07-20 10:36:25 |
| FARM009 | Ceylon Premium Farms  | Ratnapura    | 2025-07-20 10:36:26 |

---

## 🚚 TRANSPORTERS

| ID       | Name                   | Registration Date   |
| -------- | ---------------------- | ------------------- |
| TRANS002 | TestTransporter2       | 2025-07-20 10:32:04 |
| TRANS003 | Swift Logistics Ltd    | 2025-07-20 10:36:26 |
| TRANS004 | Tea Express Transport  | 2025-07-20 10:36:26 |
| TRANS005 | Premium Cargo Services | 2025-07-20 10:36:26 |

---

## 🛒 BUYERS

| ID     | Name                     | Registration Date   |
| ------ | ------------------------ | ------------------- |
| BUY001 | The Tea House            | 2025-07-20 09:59:35 |
| BUY002 | TestBuyer2               | 2025-07-20 10:32:04 |
| BUY003 | Global Tea Importers     | 2025-07-20 10:36:26 |
| BUY004 | Luxury Tea Boutique      | 2025-07-20 10:36:26 |
| BUY005 | Tea & Coffee Wholesalers | 2025-07-20 10:36:26 |

---

## 🍃 TEA BATCHES

### **Complete Supply Chain (TEA001)**

- **Batch ID**: TEA001
- **Farmer**: FARM001 (GreenField Farms)
- **Variety**: CeylonBlack
- **Quantity**: 100kg
- **Price**: $25.50
- **Quality**: 95/100
- **Fertilizer**: Organic
- **Weather**: Sunny
- **Current Owner**: BUY001 (The Tea House)
- **Status**: ✅ Complete (Farmer → Transporter → Buyer)

### **Complete Supply Chain (TEA007)**

- **Batch ID**: TEA007
- **Farmer**: FARM007 (Highland Tea Gardens)
- **Variety**: CeylonBlack
- **Quantity**: 100kg
- **Price**: $45.00
- **Quality**: 95/100
- **Fertilizer**: Organic
- **Weather**: Sunny
- **Current Owner**: BUY003 (Global Tea Importers)
- **Status**: ✅ Complete (Farmer → Transporter → Buyer)

### **At Farmer (TEA008)**

- **Batch ID**: TEA008
- **Farmer**: FARM008 (Mountain View Estates)
- **Variety**: CeylonGreen
- **Quantity**: 75kg
- **Price**: $35.00
- **Quality**: 92/100
- **Fertilizer**: Organic
- **Weather**: Cloudy
- **Current Owner**: FARM008
- **Status**: 🏠 At Farmer (Ready for shipping)

### **At Farmer (TEA009)**

- **Batch ID**: TEA009
- **Farmer**: FARM009 (Ceylon Premium Farms)
- **Variety**: CeylonOolong
- **Quantity**: 50kg
- **Price**: $60.00
- **Quality**: 98/100
- **Fertilizer**: Premium
- **Weather**: Sunny
- **Current Owner**: FARM009
- **Status**: 🏠 At Farmer (Ready for shipping)

---

## 🔄 Supply Chain Status

### **✅ Completed Supply Chains:**

1. **TEA001**: FARM001 → Transporter → BUY001
2. **TEA007**: FARM007 → TRANS003 → BUY003

### **🏠 Ready for Shipping:**

1. **TEA008**: FARM008 (CeylonGreen, 75kg)
2. **TEA009**: FARM009 (CeylonOolong, 50kg)

---

## 📜 Transaction History Example

### **TEA007 Complete Journey:**

```
1. 2025-07-20 10:36:27 - Created by FARM007 (Highland Tea Gardens)
   - Owner: FARM007
   - Status: FARMER

2. 2025-07-20 10:37:32 - Shipped to TRANS003 (Swift Logistics Ltd)
   - Owner: TRANS003
   - Status: TRANSPORTER

3. 2025-07-20 10:37:45 - Received by BUY003 (Global Tea Importers)
   - Owner: BUY003
   - Status: BUYER
```

---

## 🔍 How to View Data

### **Quick Commands:**

```bash
# View all data quickly
./quick-view.sh

# View comprehensive data with export
./view-all-data.sh

# Query specific entity
./net-tln.sh invoke query "TEA007"

# View transaction history
./net-tln.sh invoke queryHistory "TEA007"
```

### **Manual Queries:**

```bash
# Query farmers
./net-tln.sh invoke query "FARM001"
./net-tln.sh invoke query "FARM007"

# Query tea batches
./net-tln.sh invoke query "TEA001"
./net-tln.sh invoke query "TEA007"

# Query buyers
./net-tln.sh invoke query "BUY001"
./net-tln.sh invoke query "BUY003"
```

---

## 📊 Data Quality Metrics

### **Tea Varieties:**

- **CeylonBlack**: 2 batches (TEA001, TEA007)
- **CeylonGreen**: 1 batch (TEA008)
- **CeylonOolong**: 1 batch (TEA009)

### **Quality Distribution:**

- **95+ (Premium)**: 2 batches
- **90-94 (High)**: 1 batch
- **85-89 (Standard)**: 0 batches

### **Geographic Distribution:**

- **Nuwara Eliya**: 1 farmer
- **Kandy**: 1 farmer
- **Badulla**: 1 farmer
- **Ratnapura**: 1 farmer

---

## 🚀 Next Steps

### **Complete Remaining Supply Chains:**

```bash
# Ship TEA008 to transporter
./net-tln.sh invoke shipToTransporter "TEA008" "TRANS004"

# Receive TEA008 by buyer
./net-tln.sh invoke receiveByBuyer "TEA008" "BUY004"

# Ship TEA009 to transporter
./net-tln.sh invoke shipToTransporter "TEA009" "TRANS005"

# Receive TEA009 by buyer
./net-tln.sh invoke receiveByBuyer "TEA009" "BUY005"
```

### **Create New Entities:**

```bash
# Create new farmer
./net-tln.sh invoke registerFarmer "FARM011" "New Tea Estate" "Galle"

# Create new tea batch
./net-tln.sh invoke createTeaBatch "FARM011" "TEA011" "CeylonWhite" "FARM011" "hash_tea011" "25kg" "80.00" "99" "Premium" "Misty"
```

---

## 📋 Data Export

All blockchain data can be exported to JSON format using:

```bash
./view-all-data.sh
```

This creates a timestamped JSON file with all entities and their metadata.

---

_Last Updated: 2025-07-20_
_Total Records: 17 entities_
