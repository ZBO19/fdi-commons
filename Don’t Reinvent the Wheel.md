# **1\. What Already Exists (So We Don’t Reinvent the Wheel)**

There are several important systems in this space.

## **FDA / Regulatory Label Infrastructure**

### **DailyMed**

DailyMed provides the official **Structured Product Labeling (SPL)** XML files submitted to the FDA. These contain the full prescribing information for drugs and are downloadable for computational analysis.

### **openFDA**

openFDA provides APIs that allow developers to query structured data extracted from SPL labels, including drug interactions and warnings.

### **FDALabel**

FDALabel is a full-text search interface that indexes SPL drug labeling documents.

**Important:**  
 All three give **access to labeling text**, but **none create a structured food–drug interaction dataset.**

---

# **2\. Existing Drug Interaction Databases**

These contain **drug–drug interactions**, not food–drug interactions.

### **DrugBank**

A large drug database containing pharmacological targets and interactions.

### **KEGG**

Contains drug pathways and biochemical relationships.

### **ChEMBL**

Large repository of drug–target activity data.

### **SIDER**

Database of adverse drug reactions extracted from drug labels.

These systems **mine label text**, but none focus on **food interactions**.

---

# **3\. Research Projects Close to Your Idea**

Some biomedical NLP research has extracted information from labels.

Example research areas:

• drug adverse events from labeling  
 • pharmacogenomic label statements  
 • drug–drug interaction extraction

However:

**Food–drug interactions are rarely the primary target.**

This is the opportunity.

---

# **4\. The Real Gap**

The missing infrastructure is:

food–drug interaction knowledge  
\+  
regulatory label provenance  
\+  
structured dataset

No major dataset currently combines these three elements.

This is exactly where your project fits.

---

# **5\. What You Should Build First (Proof System)**

Do not start with the full platform.

Start with a **proof of capability**.

### **Project Name**

FDI Commons v0

---

## **Goal**

Extract **food interaction statements from FDA labels**.

---

## **Minimal Pipeline**

Step 1  
 Download 500 SPL labels.

Step 2  
 Extract relevant sections:

Clinical Pharmacology  
Drug Interactions  
Dosage and Administration

Step 3  
 Identify food terms.

Examples:

grapefruit  
food  
meal  
diet  
protein  
calcium  
iron  
magnesium  
vitamin  
coffee  
alcohol

Step 4  
 Extract sentences containing those words.

Step 5  
 Store with provenance.

---

## **Example Output**

drug: simvastatin  
food: grapefruit juice  
effect: increased exposure  
mechanism: CYP3A4 inhibition  
label\_section: Drug Interactions  
source: label sentence  
---

# **6\. What This Demonstrates**

This small system proves:

• SPL ingestion  
 • interaction extraction  
 • provenance tracking  
 • dataset creation

This is exactly what academics want to see.

---

# **7\. What the Dataset Might Look Like**

After the first pass you might obtain:

1,000–3,000 interaction statements

Typical patterns:

take with food  
take without food  
avoid grapefruit  
avoid alcohol  
separate from calcium  
---

# **8\. The First Research Paper**

A strong title would be something like:

**“Extracting Food–Drug Interaction Knowledge from Regulatory Drug Labeling: Creation of the FDI Commons Dataset.”**

Sections:

1. problem

2. extraction system

3. dataset

4. evaluation

---

# **9\. Small Demo You Should Build**

This is the **killer demo for professors**.

Simple web page.

Search:

food: grapefruit

Return:

list of drugs affected  
mechanism  
source label text

This immediately shows the value.

---

# **10\. Funding Alignment (Important)**

This idea aligns with several research priorities.

### **NIH**

Precision medicine  
 drug safety  
 AI in health

### **DARPA**

AI knowledge extraction  
 large-scale biomedical knowledge graphs

### **EU Horizon**

digital health  
 nutrition and health

---

# **11\. How to Avoid Reinventing the Wheel**

Always follow this rule:

build on existing datasets  
extract new structure  
add provenance

Do not duplicate:

DrugBank  
 KEGG  
 ChEMBL

Instead **link to them.**

---

# **12\. Ideal Architecture**

Simple but scalable.

SPL labels  
↓  
Parser  
↓  
interaction extraction  
↓  
FDI dataset  
↓  
API  
↓  
knowledge graph  
---

# **13\. Timeline for the Thesis**

Month 1

label ingestion  
 basic extractor

Month 2

schema  
 dataset creation

Month 3

evaluation

Month 4–6

knowledge graph \+ paper

---

# **My Honest Assessment**

You are **not reinventing the wheel**.

You are building the missing layer between:

regulatory labeling  
and  
structured pharmacology knowledge

That layer does not exist yet.

---

# **One Final Strategic Suggestion**

Before contacting universities you should also build:

**a small prototype in 2–3 weeks.**

Even something extracting **200 interactions** from labels would make professors take the project far more seriously.

---

If you'd like, I can also show you something extremely useful:

**The exact 3-week prototype plan that would make Stanford / Harvard professors immediately take this project seriously.**

