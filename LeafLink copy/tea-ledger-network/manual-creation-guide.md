# Manual Creation Guide for Tea Ledger Network

## 🌱 How to Create Farmers and Tea Batches

### **Step 1: Create a Farmer**

```bash
./net-tln.sh invoke registerFarmer "FARM_ID" "Farmer Name" "Location"
```

**Example:**

```bash
./net-tln.sh invoke registerFarmer "FARM011" "Sunrise Tea Estate" "Nuwara Eliya"
```

### **Step 2: Create a Transporter**

```bash
./net-tln.sh invoke registerTransporter "TRANS_ID" "Transporter Name"
```

**Example:**

```bash
./net-tln.sh invoke registerTransporter "TRANS006" "Fast Track Logistics"
```

### **Step 3: Create a Buyer**

```bash
./net-tln.sh invoke registerBuyer "BUY_ID" "Buyer Name"
```

**Example:**

```bash
./net-tln.sh invoke registerBuyer "BUY006" "Premium Tea Importers"
```

### **Step 4: Create a Tea Batch**

```bash
./net-tln.sh invoke createTeaBatch "FARMER_ID" "BATCH_ID" "VARIETY" "OWNER" "IMAGE_HASH" "QUANTITY" "PRICE" "QUALITY" "FERTILIZER" "WEATHER"
```

**Parameters:**

- `FARMER_ID`: ID of the registered farmer
- `BATCH_ID`: Unique batch identifier
- `VARIETY`: Type of tea (CeylonBlack, CeylonGreen, CeylonOolong, CeylonWhite)
- `OWNER`: Current owner (usually same as FARMER_ID initially)
- `IMAGE_HASH`: Hash or URL of tea batch image
- `QUANTITY`: Weight in kg (e.g., "100kg")
- `PRICE`: Starting price (e.g., "45.00")
- `QUALITY`: Quality score (0-100)
- `FERTILIZER`: Type of fertilizer used
- `WEATHER`: Weather conditions during harvest

**Example:**

```bash
./net-tln.sh invoke createTeaBatch "FARM011" "TEA011" "CeylonBlack" "FARM011" "hash_tea011" "100kg" "45.00" "95" "Organic" "Sunny"
```

### **Step 5: Ship Tea to Transporter**

```bash
./net-tln.sh invoke shipToTransporter "BATCH_ID" "TRANS_ID"
```

**Example:**

```bash
./net-tln.sh invoke shipToTransporter "TEA011" "TRANS006"
```

### **Step 6: Receive Tea by Buyer**

```bash
./net-tln.sh invoke receiveByBuyer "BATCH_ID" "BUY_ID"
```

**Example:**

```bash
./net-tln.sh invoke receiveByBuyer "TEA011" "BUY006"
```

## 🔍 How to Query Entities

### **Query a Farmer**

```bash
./net-tln.sh invoke query "FARM_ID"
```

### **Query a Tea Batch**

```bash
./net-tln.sh invoke query "BATCH_ID"
```

### **Query a Buyer**

```bash
./net-tln.sh invoke query "BUY_ID"
```

### **Query Transaction History**

```bash
./net-tln.sh invoke queryHistory "ENTITY_ID"
```

## 📋 Complete Example Workflow

Here's a complete example of creating a tea supply chain:

```bash
# 1. Create farmer
./net-tln.sh invoke registerFarmer "FARM012" "Golden Valley Tea" "Kandy"

# 2. Create transporter
./net-tln.sh invoke registerTransporter "TRANS007" "Express Cargo"

# 3. Create buyer
./net-tln.sh invoke registerBuyer "BUY007" "Tea World Ltd"

# 4. Create tea batch
./net-tln.sh invoke createTeaBatch "FARM012" "TEA012" "CeylonGreen" "FARM012" "hash_tea012" "75kg" "35.00" "92" "Organic" "Cloudy"

# 5. Ship to transporter
./net-tln.sh invoke shipToTransporter "TEA012" "TRANS007"

# 6. Receive by buyer
./net-tln.sh invoke receiveByBuyer "TEA012" "BUY007"

# 7. Query the final state
./net-tln.sh invoke query "TEA012"
```

## 🚀 Quick Creation Script

You can also use the automated script:

```bash
./create-entities.sh
```

This will create multiple farmers, transporters, buyers, and tea batches automatically.

## 📊 Tea Varieties and Quality Guidelines

### **Tea Varieties:**

- **CeylonBlack**: Traditional black tea
- **CeylonGreen**: Light, fresh green tea
- **CeylonOolong**: Semi-oxidized tea
- **CeylonWhite**: Premium white tea

### **Quality Scores:**

- **90-100**: Premium grade
- **80-89**: High grade
- **70-79**: Standard grade
- **Below 70**: Basic grade

### **Fertilizer Types:**

- **Organic**: Natural fertilizers
- **Premium**: High-quality synthetic
- **Standard**: Regular fertilizers

### **Weather Conditions:**

- **Sunny**: Clear, dry weather
- **Cloudy**: Overcast conditions
- **Misty**: Light fog/mist
- **Rainy**: Wet conditions

## ⚠️ Important Notes

1. **Order Matters**: Always create entities in the correct order:

   - Farmer → Tea Batch → Transporter → Buyer
   - Ship → Receive

2. **Unique IDs**: Each entity must have a unique ID

3. **Dependencies**: Tea batches require registered farmers

   - Shipping requires registered transporters
   - Receiving requires registered buyers

4. **Batch Timeout**: First transaction in a batch may take 2-3 seconds due to consensus timeout

## 🎯 Best Practices

1. **Use Descriptive Names**: Make entity names meaningful
2. **Consistent ID Format**: Use consistent ID patterns (FARM001, TEA001, etc.)
3. **Quality Documentation**: Record accurate quality scores and conditions
4. **Regular Queries**: Query entities to verify successful creation
5. **Error Handling**: Check for errors and retry if needed
