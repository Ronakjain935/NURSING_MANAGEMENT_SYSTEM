"""
PlantVerse AI - Dataset & Jupyter Notebook Generator
Generates realistic agricultural CSV datasets and Jupyter Notebooks for Crop Recommendation & Disease Diagnostics.
"""

import os
import json
import random
import csv

def generate_crop_recommendation_dataset():
    filepath = "crop_recommendation_dataset.csv"
    crops_profile = {
        "rice": {"n": (80, 120), "p": (35, 60), "k": (35, 45), "temp": (20, 27), "hum": (80, 90), "ph": (5.5, 6.9), "rain": (180, 300)},
        "wheat": {"n": (60, 90), "p": (30, 50), "k": (20, 40), "temp": (15, 23), "hum": (50, 70), "ph": (6.0, 7.5), "rain": (50, 100)},
        "maize": {"n": (70, 100), "p": (40, 60), "k": (15, 30), "temp": (18, 27), "hum": (55, 75), "ph": (5.8, 7.0), "rain": (60, 110)},
        "cotton": {"n": (110, 140), "p": (35, 60), "k": (18, 35), "temp": (22, 32), "hum": (60, 80), "ph": (5.8, 8.0), "rain": (60, 110)},
        "sugarcane": {"n": (130, 160), "p": (40, 65), "k": (40, 60), "temp": (24, 35), "hum": (70, 85), "ph": (6.0, 7.8), "rain": (150, 250)},
        "coffee": {"n": (90, 120), "p": (15, 35), "k": (25, 45), "temp": (23, 28), "hum": (55, 70), "ph": (6.0, 6.8), "rain": (110, 180)},
        "tea": {"n": (100, 130), "p": (20, 40), "k": (30, 50), "temp": (18, 25), "hum": (75, 90), "ph": (4.5, 5.8), "rain": (150, 250)},
        "banana": {"n": (90, 120), "p": (70, 95), "k": (45, 55), "temp": (25, 31), "hum": (75, 88), "ph": (5.5, 6.8), "rain": (90, 140)},
        "mango": {"n": (15, 40), "p": (15, 35), "k": (25, 40), "temp": (27, 36), "hum": (45, 65), "ph": (5.5, 7.2), "rain": (70, 120)},
        "chickpea": {"n": (35, 50), "p": (55, 75), "k": (75, 85), "temp": (17, 22), "hum": (15, 25), "ph": (5.9, 8.5), "rain": (65, 95)},
        "kidneybeans": {"n": (15, 35), "p": (60, 80), "k": (15, 25), "temp": (15, 24), "hum": (18, 25), "ph": (5.5, 5.9), "rain": (60, 150)},
        "pomegranate": {"n": (15, 40), "p": (10, 30), "k": (35, 45), "temp": (18, 25), "hum": (85, 95), "ph": (5.5, 7.2), "rain": (100, 115)},
        "apple": {"n": (0, 40), "p": (120, 145), "k": (195, 205), "temp": (21, 24), "hum": (90, 95), "ph": (5.5, 6.5), "rain": (100, 125)},
        "orange": {"n": (15, 40), "p": (10, 30), "k": (5, 15), "temp": (10, 35), "hum": (90, 95), "ph": (6.0, 7.5), "rain": (100, 120)},
        "papaya": {"n": (45, 70), "p": (45, 70), "k": (45, 55), "temp": (23, 34), "hum": (90, 95), "ph": (6.5, 7.0), "rain": (140, 250)},
        "coconut": {"n": (15, 40), "p": (10, 30), "k": (25, 35), "temp": (25, 29), "hum": (90, 98), "ph": (5.5, 6.5), "rain": (130, 220)},
        "jute": {"n": (60, 90), "p": (35, 55), "k": (35, 45), "temp": (23, 27), "hum": (70, 85), "ph": (6.0, 7.4), "rain": (150, 200)},
        "watermelon": {"n": (80, 120), "p": (10, 30), "k": (45, 55), "temp": (24, 27), "hum": (80, 90), "ph": (6.0, 7.0), "rain": (40, 60)},
        "grapes": {"n": (15, 40), "p": (120, 145), "k": (195, 205), "temp": (8, 42), "hum": (80, 90), "ph": (5.5, 7.0), "rain": (60, 90)}
    }

    records = []
    random.seed(42)

    for crop, prof in crops_profile.items():
        for _ in range(40): # 40 samples per crop = 760 total dataset rows
            n = int(random.uniform(*prof["n"]))
            p = int(random.uniform(*prof["p"]))
            k = int(random.uniform(*prof["k"]))
            temp = round(random.uniform(*prof["temp"]), 2)
            hum = round(random.uniform(*prof["hum"]), 2)
            ph = round(random.uniform(*prof["ph"]), 2)
            rain = round(random.uniform(*prof["rain"]), 2)
            records.append([n, p, k, temp, hum, ph, rain, crop])

    random.shuffle(records)

    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["N", "P", "K", "temperature", "humidity", "ph", "rainfall", "label"])
        writer.writerows(records)

    print(f"Generated {filepath} with {len(records)} rows.")

def generate_crop_disease_dataset():
    filepath = "crop_disease_dataset.csv"
    diseases = [
        ("Tomato", "Early Blight", "fungal", "Mancozeb 75% WP", "High"),
        ("Tomato", "Late Blight", "fungal", "Copper Oxychloride", "Critical"),
        ("Potato", "Late Blight", "fungal", "Cymoxanil + Mancozeb", "Critical"),
        ("Wheat", "Leaf Rust", "fungal", "Propiconazole 25% EC", "High"),
        ("Rose", "Powdery Mildew", "fungal", "Neem Oil 1500ppm / Sulfur Spray", "Medium"),
        ("Monstera", "Spider Mites", "pest", "Abamectin / Insecticidal Soap", "Medium"),
        ("Citrus", "Bacterial Canker", "bacterial", "Streptomycin Sulfate + Copper", "Critical"),
        ("Rice", "Bacterial Leaf Blight", "bacterial", "Copper Hydroxide", "High"),
        ("Apple", "Apple Scab", "fungal", "Captan 50% WP", "Medium"),
        ("Grape", "Black Rot", "fungal", "Myclobutanil", "High"),
        ("Tulsi", "Cercospora Leaf Spot", "fungal", "Organic Neem Leaf Extract", "Low"),
        ("Corn", "Northern Leaf Blight", "fungal", "Azoxystrobin", "High"),
        ("Cotton", "Bacterial Blight", "bacterial", "Copper Oxychloride + Agrimycin", "Critical"),
        ("Sugarcane", "Red Rot", "fungal", "Carbendazim 50% WP", "Critical"),
        ("Plant", "Healthy Leaf", "none", "Optimal Irrigation & N-P-K Balanced Soil", "None")
    ]

    records = []
    random.seed(42)

    for i in range(1, 601):
        crop, disease, dtype, treatment, urgency = random.choice(diseases)
        if disease == "Healthy Leaf":
            affected_pct = round(random.uniform(0.0, 1.5), 2)
            spot_count = random.randint(0, 2)
            chlorosis = round(random.uniform(0.0, 0.2), 2)
            confidence = round(random.uniform(96.5, 99.8), 2)
            severity = "Healthy"
        else:
            affected_pct = round(random.uniform(12.0, 85.0), 2)
            spot_count = random.randint(15, 180)
            chlorosis = round(random.uniform(0.3, 0.95), 2)
            confidence = round(random.uniform(88.0, 99.2), 2)
            severity = "Severe" if affected_pct > 50 else ("Moderate" if affected_pct > 25 else "Mild")

        records.append([
            f"IMG-2026-{i:04d}", crop, disease, dtype, severity, affected_pct, spot_count, chlorosis, confidence, urgency, treatment
        ])

    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "sample_id", "crop_name", "disease_name", "pathogen_type", "severity_grade",
            "affected_leaf_area_pct", "leaf_spot_count", "chlorosis_index", "ai_confidence_pct", "urgency_level", "recommended_treatment"
        ])
        writer.writerows(records)

    print(f"Generated {filepath} with {len(records)} rows.")

def make_notebook(cells):
    return {
        "cells": cells,
        "metadata": {
            "kernelspec": {
                "display_name": "Python 3 (ipykernel)",
                "language": "python",
                "name": "python3"
            },
            "language_info": {
                "codemirror_mode": { "name": "ipython", "version": 3 },
                "file_extension": ".py",
                "mimetype": "text/x-python",
                "name": "python",
                "nbconvert_exporter": "python",
                "pygments_lexer": "ipython3",
                "version": "3.10.0"
            }
        },
        "nbformat": 4,
        "nbformat_minor": 2
    }

def make_markdown_cell(source_text):
    return {
        "cell_type": "markdown",
        "metadata": {},
        "source": source_text.splitlines(keepends=True)
    }

def make_code_cell(code_text):
    return {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": code_text.splitlines(keepends=True)
    }

def build_crop_recommendation_notebook():
    cells = [
        make_markdown_cell(
"""# 🌾 PlantVerse AI - Crop Recommendation System (Machine Learning & EDA)
**Project Title**: AI-Powered Smart Nursery & Plant Care Platform  
**Notebook Target**: Agronomy Soil N-P-K & Environmental Feature Analytics, Model Training, Evaluation & Visualizations.

---

### Notebook Highlights:
1. **Exploratory Data Analysis (EDA)**: Soil Nutrients ($N, P, K$), Temperature, Humidity, pH, and Rainfall distributions.
2. **Feature Correlation Heatmap**: Visualizing feature interactions across 19 crop species.
3. **Machine Learning Model Training**: Random Forest Classifier & Decision Tree Classifier comparison.
4. **Performance Evaluation**: Classification Report, Confusion Matrix, and Feature Importance Rankings.
5. **Real-time Crop Recommendation Engine**: Interactive inference function predicting optimal crops for given soil inputs.
"""),
        make_code_cell(
"""import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

# Styling
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
sns.set_palette('crest')
print("✅ ML & Data Visualization Libraries Loaded Successfully!")
"""),
        make_markdown_cell(
"""---
## Step 1: Dataset Loading & Overview
Loading synthetic dataset `crop_recommendation_dataset.csv` generated for 19 crop species (Basmati Rice, Wheat, Cotton, Sugarcane, Coffee, Tea, Banana, Mango, Apple, etc.).
"""),
        make_code_cell(
"""# Load dataset
df = pd.read_csv('crop_recommendation_dataset.csv')

print(f"Dataset Shape: {df.shape[0]} rows, {df.shape[1]} columns")
print("\\nHead of Dataset:")
display(df.head())

print("\\nDataset Summary Statistics:")
display(df.describe())

print("\\nCrop Value Counts:")
print(df['label'].value_counts())
"""),
        make_markdown_cell(
"""---
## Step 2: Exploratory Data Analysis & Feature Visualizations
Analyzing how Nitrogen ($N$), Phosphorus ($P$), Potassium ($K$), Temperature, Humidity, pH, and Rainfall govern crop suitability.
"""),
        make_code_cell(
"""plt.figure(figsize=(16, 12))

# Subplot 1: Nitrogen Distribution by Top Crops
plt.subplot(2, 2, 1)
sns.boxplot(data=df, x='label', y='N', palette='viridis')
plt.title('Nitrogen (N) Requirement Across Crops', fontsize=12, fontweight='bold')
plt.xticks(rotation=60)

# Subplot 2: Rainfall Distribution by Crops
plt.subplot(2, 2, 2)
sns.boxplot(data=df, x='label', y='rainfall', palette='Blues_r')
plt.title('Rainfall (mm) Requirement Across Crops', fontsize=12, fontweight='bold')
plt.xticks(rotation=60)

# Subplot 3: Temperature vs Humidity Scatter
plt.subplot(2, 2, 3)
sns.scatterplot(data=df, x='temperature', y='humidity', hue='label', legend=False, alpha=0.8, palette='Spectral')
plt.title('Temperature vs Humidity Clusters', fontsize=12, fontweight='bold')

# Subplot 4: pH Distribution
plt.subplot(2, 2, 4)
sns.histplot(df['ph'], kde=True, color='teal', bins=25)
plt.title('Soil pH Distribution', fontsize=12, fontweight='bold')

plt.tight_layout()
plt.show()
"""),
        make_markdown_cell(
"""### Feature Correlation Heatmap
Understanding feature collinearly between soil parameters and climate variables.
"""),
        make_code_cell(
"""plt.figure(figsize=(10, 7))
numeric_df = df.drop(columns=['label'])
corr = numeric_df.corr()
sns.heatmap(corr, annot=True, cmap='YlGnBu', fmt='.2f', linewidths=0.5)
plt.title('Agronomy Feature Correlation Heatmap', fontsize=14, fontweight='bold')
plt.show()
"""),
        make_markdown_cell(
"""---
## Step 3: Machine Learning Model Training (Random Forest & Decision Tree)
Splitting data into 80% Training and 20% Testing sets and training Scikit-Learn models.
"""),
        make_code_cell(
"""X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = df['label']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

print(f"Training set size: {X_train.shape[0]} samples")
print(f"Testing set size:  {X_test.shape[0]} samples")

# Train Random Forest Classifier
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)
y_pred_rf = rf_model.predict(X_test)

# Train Decision Tree Classifier
dt_model = DecisionTreeClassifier(random_state=42)
dt_model.fit(X_train, y_train)
y_pred_dt = dt_model.predict(X_test)

rf_acc = accuracy_score(y_test, y_pred_rf)
dt_acc = accuracy_score(y_test, y_pred_dt)

print(f"🎯 Random Forest Accuracy: {rf_acc * 100:.2f}%")
print(f"🎯 Decision Tree Accuracy: {dt_acc * 100:.2f}%")
"""),
        make_markdown_cell(
"""---
## Step 4: Model Evaluation & Feature Importance Analysis
Evaluating precision, recall, confusion matrix, and feature importances.
"""),
        make_code_cell(
"""print("================ CLASSIFICATION REPORT (Random Forest) ================")
print(classification_report(y_test, y_pred_rf))

# Confusion Matrix Plot
plt.figure(figsize=(12, 10))
cm = confusion_matrix(y_test, y_pred_rf)
sns.heatmap(cm, annot=True, fmt='d', xticklabels=rf_model.classes_, yticklabels=rf_model.classes_, cmap='Greens')
plt.title('Crop Recommendation Confusion Matrix', fontsize=14, fontweight='bold')
plt.xlabel('Predicted Crop', fontweight='bold')
plt.ylabel('Actual Crop', fontweight='bold')
plt.xticks(rotation=45)
plt.yticks(rotation=0)
plt.tight_layout()
plt.show()
"""),
        make_markdown_cell(
"""### Feature Importance Bar Chart
Which agronomy metric has the highest influence on crop selection?
"""),
        make_code_cell(
"""importances = rf_model.feature_importances_
features = X.columns
feature_imp_df = pd.DataFrame({'Feature': features, 'Importance': importances}).sort_values(by='Importance', ascending=False)

plt.figure(figsize=(8, 5))
sns.barplot(data=feature_imp_df, x='Importance', y='Feature', palette='emerald')
plt.title('Agronomy Feature Importances (Random Forest)', fontsize=13, fontweight='bold')
plt.xlabel('Importance Weight', fontweight='bold')
plt.tight_layout()
plt.show()
"""),
        make_markdown_cell(
"""---
## Step 5: Real-Time Crop Recommendation Predictor Function
Simulating the PlantVerse AI recommendation engine API.
"""),
        make_code_cell(
"""def recommend_crop(N, P, K, temp, humidity, ph, rainfall):
    input_data = pd.DataFrame([[N, P, K, temp, humidity, ph, rainfall]], 
                              columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'])
    predicted_crop = rf_model.predict(input_data)[0]
    probs = rf_model.predict_proba(input_data)[0]
    confidence = max(probs) * 100
    
    print("🌾 ================= CROP RECOMMENDATION RESULT =================")
    print(f"Input Soil Parameters: N={N}, P={P}, K={K}, pH={ph}")
    print(f"Input Climate: Temp={temp}°C, Humidity={humidity}%, Rainfall={rainfall}mm")
    print(f"🌱 Recommended Optimal Crop : {predicted_crop.upper()}")
    print(f"📊 AI Confidence Score       : {confidence:.2f}%")
    print("================================================================")
    return predicted_crop

# Test Inference 1: Rice Conditions (High rainfall & high humidity)
recommend_crop(N=95, P=45, K=40, temp=24.5, humidity=85.0, ph=6.2, rainfall=220.0)

# Test Inference 2: Wheat Conditions (Moderate rainfall & cool temp)
recommend_crop(N=75, P=40, K=30, temp=18.0, humidity=60.0, ph=6.8, rainfall=75.0)

# Test Inference 3: Tea Conditions (Acidic soil & high rainfall)
recommend_crop(N=110, P=30, K=40, temp=21.0, humidity=82.0, ph=5.0, rainfall=200.0)
""")
    ]
    return make_notebook(cells)

def build_crop_disease_notebook():
    cells = [
        make_markdown_cell(
"""# 🍃 PlantVerse AI - Crop Disease Prediction & Computer Vision Pathology
**Project Title**: AI-Powered Smart Nursery & Plant Care Platform  
**Notebook Target**: Leaf Pathology Image Feature Analysis, Disease Severity Assessment, PyTorch ResNet-50 Pipeline & Treatment Recommendations.

---

### Notebook Highlights:
1. **Disease Pathology Dataset Analysis**: Exploring severity distribution, affected leaf surface area, and pathogen types.
2. **Exploratory Visualizations**: Severity index, chlorosis levels, and treatment urgency matrices.
3. **Computer Vision Feature Extraction**: Simulating leaf spot density and surface chlorosis metrics.
4. **PyTorch ResNet-50 Model Architecture**: Neural Network transfer learning pipeline workflow & loss curve visualization.
5. **Pathology Diagnostic Engine**: Automated disease diagnosis, confidence scoring, and treatment protocols.
"""),
        make_code_cell(
"""import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

# Visualization styling
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
sns.set_palette('rocket_r')
print("✅ Pathology Diagnostics & Computer Vision Libraries Ready!")
"""),
        make_markdown_cell(
"""---
## Step 1: Loading Pathology Dataset
Loading synthetic dataset `crop_disease_dataset.csv` containing 600 leaf diagnostic samples with severity grades, affected leaf surface percentages, chlorosis scores, and fungicide treatments.
"""),
        make_code_cell(
"""df_disease = pd.read_csv('crop_disease_dataset.csv')

print(f"Pathology Dataset Shape: {df_disease.shape[0]} diagnostic samples, {df_disease.shape[1]} metrics")
print("\\nSample Pathology Entries:")
display(df_disease.head())

print("\\nDisease Count Summary:")
print(df_disease['disease_name'].value_counts())
"""),
        make_markdown_cell(
"""---
## Step 2: Exploratory Data Analysis & Visualizations
Analyzing affected leaf area vs spot counts across fungal, bacterial, pest, and healthy plant samples.
"""),
        make_code_cell(
"""plt.figure(figsize=(16, 12))

# Subplot 1: Disease Frequency Bar Chart
plt.subplot(2, 2, 1)
sns.countplot(data=df_disease, y='disease_name', order=df_disease['disease_name'].value_counts().index, palette='magma')
plt.title('Disease Frequency in Nursery Diagnostics', fontsize=12, fontweight='bold')
plt.xlabel('Sample Count')

# Subplot 2: Affected Leaf Surface Area by Disease
plt.subplot(2, 2, 2)
sns.boxplot(data=df_disease, y='disease_name', x='affected_leaf_area_pct', palette='copper')
plt.title('Affected Leaf Surface Area (%)', fontsize=12, fontweight='bold')
plt.xlabel('Affected Area (%)')

# Subplot 3: Chlorosis vs Spot Count Scatter
plt.subplot(2, 2, 3)
sns.scatterplot(data=df_disease, x='leaf_spot_count', y='chlorosis_index', hue='severity_grade', palette='flare', alpha=0.8)
plt.title('Leaf Spot Density vs Chlorosis Index', fontsize=12, fontweight='bold')

# Subplot 4: Urgency Level Breakdown
plt.subplot(2, 2, 4)
df_disease['urgency_level'].value_counts().plot(kind='pie', autopct='%1.1f%%', colors=['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71'])
plt.title('Treatment Urgency Level Distribution', fontsize=12, fontweight='bold')

plt.tight_layout()
plt.show()
"""),
        make_markdown_cell(
"""---
## Step 3: PyTorch ResNet-50 Transfer Learning Simulation
Visualizing model training curves (Training Loss vs Validation Accuracy) for PyTorch ResNet-50 computer vision leaf pathology classifier.
"""),
        make_code_cell(
"""# Simulated Training Epoch Metrics for PyTorch ResNet-50 Fine-Tuning
epochs = np.arange(1, 21)
train_loss = 1.8 * np.exp(-0.25 * epochs) + 0.05 + np.random.normal(0, 0.02, 20)
val_accuracy = 100 * (1 - 0.7 * np.exp(-0.28 * epochs)) + np.random.normal(0, 0.5, 20)

plt.figure(figsize=(12, 5))

# Loss Subplot
plt.subplot(1, 2, 1)
plt.plot(epochs, train_loss, 'o-', color='#e74c3c', linewidth=2.5, label='Cross-Entropy Loss')
plt.title('PyTorch ResNet-50 Training Loss', fontsize=13, fontweight='bold')
plt.xlabel('Epoch')
plt.ylabel('Loss Value')
plt.legend()
plt.grid(True)

# Accuracy Subplot
plt.subplot(1, 2, 2)
plt.plot(epochs, val_accuracy, 's-', color='#27ae60', linewidth=2.5, label='Validation Accuracy (%)')
plt.title('PyTorch ResNet-50 Validation Accuracy', fontsize=13, fontweight='bold')
plt.xlabel('Epoch')
plt.ylabel('Accuracy (%)')
plt.legend()
plt.grid(True)

plt.tight_layout()
plt.show()
"""),
        make_markdown_cell(
"""---
## Step 4: Pathology Diagnostic Inference Engine
Interactive leaf scanner simulator providing disease identification, severity grade, confidence score, and treatment protocols.
"""),
        make_code_cell(
"""def diagnose_leaf_sample(sample_id):
    sample = df_disease[df_disease['sample_id'] == sample_id]
    if sample.empty:
        print(f"❌ Sample ID {sample_id} not found in database.")
        return
    
    row = sample.iloc[0]
    
    print("🍃 ================= PLANTVERSE AI PATHOLOGY REPORT =================")
    print(f"Sample ID           : {row['sample_id']}")
    print(f"Crop Species        : {row['crop_name']}")
    print(f"Diagnosed Pathology : {row['disease_name'].upper()}")
    print(f"Pathogen Type       : {row['pathogen_type'].capitalize()}")
    print(f"Severity Grade      : {row['severity_grade']}")
    print(f"Affected Leaf Surface: {row['affected_leaf_area_pct']}%")
    print(f"AI Confidence Score : {row['ai_confidence_pct']}%")
    print(f"Urgency Level       : {row['urgency_level'].upper()}")
    print("------------------------------------------------------------------------")
    print(f"💊 Recommended Remedy: {row['recommended_treatment']}")
    print("========================================================================\\n")

# Test Diagnostics across different crops
diagnose_leaf_sample('IMG-2026-0001')
diagnose_leaf_sample('IMG-2026-0015')
diagnose_leaf_sample('IMG-2026-0050')
""")
    ]
    return make_notebook(cells)

if __name__ == "__main__":
    generate_crop_recommendation_dataset()
    generate_crop_disease_dataset()

    # Generate Notebook 1
    nb_crop = build_crop_recommendation_notebook()
    with open("crope recommendation.ipynb", "w", encoding="utf-8") as f:
        json.dump(nb_crop, f, indent=2)
    print("Generated 'crope recommendation.ipynb'")

    # Generate Notebook 2
    nb_disease = build_crop_disease_notebook()
    with open("crop disese.ipynb", "w", encoding="utf-8") as f:
        json.dump(nb_disease, f, indent=2)
    print("Generated 'crop disese.ipynb'")
