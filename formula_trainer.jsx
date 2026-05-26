/**
 * Finance Formula Trainer
 *
 * MIT License
 * Copyright (c) 2025
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Free & open-source. Built for the community, not for profit.
 * This tool is provided as-is — it is not exhaustive, not officially vetted,
 * and makes no claim of accuracy or completeness. Use it as a complement to
 * your own study materials, not as a substitute.
 *
 * Content (formula selection, notes, topic structure): CC BY 4.0
 * Code: MIT
 *
 * Built with Claude. Content curation, formula selection and notes are mine.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useRef } from 'react';

// --- BASE DE DONNÉES COMPLÈTE & EXHAUSTIVE ---
const RAW_DATABASE = [
  // --- 1. QUANTITATIVE METHODS & ECONOMICS ---
  {
    t: "Quant & Econ", c: "Adjusted R²", n: "Pénalise l'ajout de variables non pertinentes.",
    v: [
      { p: "R^2_{adj} = 1 - \\left[ \\left( \\frac{n-1}{n-k-1} \\right) \\times ", s: " \\right]", a: "(1 - R^2)", d: ["(1 - R^2_{adj})", "(R^2 - 1)", "\\frac{n-k-1}{n-1}"] },
      { p: "R^2_{adj} = 1 - \\left[ ", s: " \\times (1 - R^2) \\right]", a: "\\left( \\frac{n-1}{n-k-1} \\right)", d: ["\\left( \\frac{n-k-1}{n-1} \\right)", "\\left( \\frac{n}{n-k} \\right)", "\\frac{n-1}{n}"] },
      { p: "", s: " = 1 - \\left[ \\left( \\frac{n-1}{n-k-1} \\right) \\times (1 - R^2) \\right]", a: "R^2_{adj}", d: ["R^2", "MSE", "F"] },
      { p: "R^2_{adj} = 1 - \\left[ \\left( \\frac{n-1}{", s: "} \\right) \\times (1 - R^2) \\right]", a: "n-k-1", d: ["n-1", "n-k", "k-1"] }
    ]
  },
  {
    t: "Quant & Econ", c: "Akaike Information Criterion (AIC)", n: "Sélection de modèle. Utile pour la PREDICTIVE PRECISION. Règle : 'The lower, the better'.",
    v: [
      { p: "\\text{AIC primarily evaluates: }", s: "", a: "\\text{Predictive Precision}", d: ["\\text{Goodness of Fit}", "\\text{Multicollinearity}", "\\text{Heteroskedasticity}"] },
      { p: "\\text{Rule for evaluating AIC: }", s: "", a: "\\text{Lower is better}", d: ["\\text{Higher is better}", "\\text{Close to 1}", "\\text{Close to 0}"] }
    ]
  },
  {
    t: "Quant & Econ", c: "Bayesian Information Criterion (BIC)", n: "Sélection de modèle. Utile pour le GOODNESS OF FIT. Pénalise fortement l'ajout de variables.",
    v: [
      { p: "\\text{Compared to AIC, BIC penalty is: }", s: "", a: "\\text{More strict}", d: ["\\text{Less strict}", "\\text{Equal}", "\\text{Zero}"] },
      { p: "\\text{BIC primarily evaluates: }", s: "", a: "\\text{Goodness of Fit}", d: ["\\text{Predictive Precision}", "\\text{Serial Correlation}", "\\text{Stationarity}"] }
    ]
  },
  {
    t: "Quant & Econ", c: "F-Statistic", n: "Significativité globale. H0: Tous les coefficients de pente = 0 simultanément. Rejet si F > F_critical. (On VEUT rejeter H0)",
    v: [
      { p: "F = \\frac{MSR}{", s: "} = \\frac{RSS/k}{SSE/(n-k-1)}", a: "MSE", d: ["SSR", "SST", "MSR"] },
      { p: "H_0 \\text{ for overall F-test: slopes } = ", s: "", a: "0", d: ["1", "\\text{Intercept}", "\\text{Standard errors}"] },
      { p: "\\text{To prove overall model validity: }", s: "", a: "\\text{Reject } H_0", d: ["\\text{Fail to reject } H_0", "\\text{Accept } H_0", "\\text{Minimize F}"] }
    ]
  },
  {
    t: "Quant & Econ", c: "t-Statistic", n: "Significativité individuelle. H0: b1 = 0 (aucun pouvoir explicatif). Rejet si |t| > t_critical. (On VEUT rejeter H0)",
    v: [
      { p: "t = \\frac{\\hat{b}_1 - b_1}{", s: "}", a: "S_{\\hat{b}_1}", d: ["\\sigma^2", "n-k-1", "MSE"] },
      { p: "\\text{If } |t| > t_{critical}\\text{, you must: }", s: "", a: "\\text{Reject } H_0", d: ["\\text{Fail to reject } H_0", "\\text{Accept } H_0", "\\text{Transform data}"] }
    ]
  },
  {
    t: "Quant & Econ", c: "Breusch-Pagan Test", n: "Teste l'hétéroscédasticité conditionnelle. H0: Homoscédasticité. Piège : Ne PAS rejeter H0, sinon erreurs standards non fiables !",
    v: [
      { p: "BP = n \\times ", s: "", a: "R^2_{residuals}", d: ["R^2_{adj}", "MSE", "SSE"] },
      { p: "H_0 \\text{ for Breusch-Pagan: }", s: "", a: "\\text{Homoskedasticity}", d: ["\\text{Heteroskedasticity}", "\\text{Multicollinearity}", "\\text{Serial Correlation}"] },
      { p: "\\text{If BP rejects } H_0\\text{, standard errors are: }", s: "", a: "\\text{Unreliable}", d: ["\\text{Reliable}", "\\text{Too large}", "\\text{Zero}"] }
    ]
  },
  {
    t: "Quant & Econ", c: "Breusch-Godfrey Test", n: "Teste l'autocorrélation sérielle. H0: Absence d'autocorrélation sérielle. Piège : Ne PAS rejeter H0 !",
    v: [
      { p: "H_0 \\text{ for Breusch-Godfrey: }", s: "", a: "\\text{No serial correlation}", d: ["\\text{Serial correlation}", "\\text{Homoskedasticity}", "\\text{Multicollinearity}"] },
      { p: "\\text{The Breusch-Godfrey test primarily detects: }", s: "", a: "\\text{Serial correlation}", d: ["\\text{Heteroskedasticity}", "\\text{Multicollinearity}", "\\text{Unit Root}"] },
      { p: "\\text{If BG test rejects } H_0\\text{, the model suffers from: }", s: "", a: "\\text{Serial correlation}", d: ["\\text{Heteroskedasticity}", "\\text{Perfect fit}", "\\text{Omitted variable bias}"] }
    ]
  },
  {
    t: "Quant & Econ", c: "Variance Inflation Factor (VIF)", n: "Détecte la multicolinéarité. Pas de H0. Seuil : VIF > 5 (attention), > 10 (sévère). Solution : supprimer une variable très corrélée.",
    v: [
      { p: "VIF = \\frac{1}{", s: "}", a: "1 - R^2_j", d: ["1 - R^2_{adj}", "R^2_j", "1 + R^2_j"] },
      { p: "\\text{VIF is primarily used to detect: }", s: "", a: "\\text{Multicollinearity}", d: ["\\text{Heteroskedasticity}", "\\text{Serial Correlation}", "\\text{Unit Root}"] },
      { p: "\\text{VIF } > 10 \\implies ", s: "", a: "\\text{Severe Multicollinearity}", d: ["\\text{Perfect Fit}", "\\text{Homoskedasticity}", "\\text{Non-stationarity}"] },
      { p: "\\text{Fix for severe Multicollinearity: }", s: "", a: "\\text{Drop correlated variable}", d: ["\\text{First differencing}", "\\text{Robust standard errors}", "\\text{Increase sample}"] }
    ]
  },
  {
    t: "Quant & Econ", c: "Mean Reverting Level", n: "Niveau vers lequel la série AR tend à long terme.",
    v: [
      { p: "x_t = \\frac{b_0}{", s: "}", a: "1 - b_1", d: ["1 + b_1", "b_1 - 1", "b_0"] },
      { p: "x_t = \\frac{", s: "}{1 - b_1}", a: "b_0", d: ["b_1", "1", "x_{t-1}"] },
      { p: "", s: " = \\frac{b_0}{1 - b_1}", a: "x_t", d: ["\\sigma^2", "t", "BP"] }
    ]
  },
  {
    t: "Quant & Econ", c: "Precision", n: "Qualité des prédictions positives.",
    v: [
      { p: "Precision = \\frac{TP}{", s: "}", a: "TP + FP", d: ["TP + FN", "TP + TN", "FP + FN"] },
      { p: "Precision = \\frac{", s: "}{TP + FP}", a: "TP", d: ["TN", "FP", "FN"] },
      { p: "", s: " = \\frac{TP}{TP + FP}", a: "Precision", d: ["Recall", "Accuracy", "F1 Score"] }
    ]
  },
  {
    t: "Quant & Econ", c: "Recall", n: "Capacité à trouver tous les vrais positifs (Sensibilité).",
    v: [
      { p: "Recall = \\frac{TP}{", s: "}", a: "TP + FN", d: ["TP + FP", "TP + TN", "FP + FN"] },
      { p: "Recall = \\frac{", s: "}{TP + FN}", a: "TP", d: ["TN", "FP", "FN"] },
      { p: "", s: " = \\frac{TP}{TP + FN}", a: "Recall", d: ["Precision", "Accuracy", "Specificity"] }
    ]
  },
  {
    t: "Quant & Econ", c: "Accuracy", n: "Proportion totale de prédictions correctes.",
    v: [
      { p: "Accuracy = \\frac{TP + TN}{", s: "}", a: "TP + FP + FN + TN", d: ["TP + TN", "TP + FP", "TN + FN"] },
      { p: "Accuracy = \\frac{", s: "}{Total}", a: "TP + TN", d: ["TP + FP", "TN + FN", "TP"] },
      { p: "", s: " = \\frac{TP + TN}{Total}", a: "Accuracy", d: ["Precision", "Recall", "F1 Score"] }
    ]
  },
  {
    t: "Quant & Econ", c: "F1 Score", n: "Moyenne harmonique de la précision et du recall.",
    v: [
      { p: "F1 = \\frac{", s: "}{Precision + Recall}", a: "2 \\times Precision \\times Recall", d: ["Precision + Recall", "\\frac{Precision \\times Recall}{2}", "Precision^2 + Recall^2"] },
      { p: "F1 = \\frac{2 \\times Precision \\times Recall}{", s: "}", a: "Precision + Recall", d: ["2", "Precision \\times Recall", "TP + TN"] },
      { p: "", s: " = \\frac{2 \\times P \\times R}{P + R}", a: "F1\\ Score", d: ["Accuracy", "ROC", "AUC"] }
    ]
  },
  {
    t: "Quant & Econ", c: "Covered Interest Rate Parity", n: "Sans opportunité d'arbitrage. Utilise les taux sans risque.",
    v: [
      { p: "F_{f/d} = S_{f/d} \\times \\frac{", s: "}{1 + i_d \\times (act/360)}", a: "1 + i_f \\times (act/360)", d: ["1 + i_d \\times (act/360)", "i_f - i_d", "1 - i_f"] },
      { p: "F_{f/d} = S_{f/d} \\times \\frac{1 + i_f \\times (act/360)}{", s: "}", a: "1 + i_d \\times (act/360)", d: ["1 + i_f \\times (act/360)", "i_d - i_f", "1 - i_d"] },
      { p: "F_{f/d} = ", s: " \\times \\frac{1 + i_f(act/360)}{1 + i_d(act/360)}", a: "S_{f/d}", d: ["S_{d/f}", "F_{d/f}", "1"] },
      { p: "", s: " = S_{f/d} \\times \\frac{1 + i_f}{1 + i_d}", a: "F_{f/d}", d: ["F_{d/f}", "E(S_{f/d})", "Real\\ FX"] }
    ]
  },
  {
    t: "Quant & Econ", c: "Uncovered Interest Rate Parity", n: "La monnaie à haut taux d'intérêt doit se déprécier.",
    v: [
      { p: "\\% \\Delta S_{f/d} = ", s: "", a: "i_f - i_d", d: ["i_d - i_f", "\\frac{i_f}{i_d}", "S_{f/d} \\times (i_f - i_d)"] },
      { p: "", s: " = i_f - i_d", a: "\\% \\Delta S_{f/d}", d: ["\\% \\Delta S_{d/f}", "F_{f/d}", "Real\\ FX"] }
    ]
  },
  {
    t: "Quant & Econ", c: "Real Exchange Rate", n: "Ajuste le pouvoir d'achat.",
    v: [
      { p: "Real\\ FX_{d/f} = \\text{Nominal FX}_{d/f} \\times ", s: "", a: "\\left( \\frac{CPI_f}{CPI_d} \\right)", d: ["\\left( \\frac{CPI_d}{CPI_f} \\right)", "(CPI_f - CPI_d)", "(1 + CPI_f)"] },
      { p: "Real\\ FX_{d/f} = ", s: " \\times \\left( \\frac{CPI_f}{CPI_d} \\right)", a: "\\text{Nominal FX}_{d/f}", d: ["\\text{Nominal FX}_{f/d}", "CPI_d", "1"] },
      { p: "", s: " = \\text{Nominal FX}_{d/f} \\times \\left( \\frac{CPI_f}{CPI_d} \\right)", a: "Real\\ FX_{d/f}", d: ["Real\\ FX_{f/d}", "Fwd\\ FX", "PPP"] }
    ]
  },
  {
    t: "Quant & Econ", c: "Taylor Rule", n: "Taux cible de la banque centrale.",
    v: [
      { p: "R_{target} = R_{neutral} + \\pi_{exp} + ", s: " + 0.5(Y_{exp} - Y_{trend})", a: "0.5(\\pi_{exp} - \\pi_{target})", d: ["0.5(\\pi_{target} - \\pi_{exp})", "(\\pi_{exp} - \\pi_{target})", "0.5(Y_{trend} - Y_{exp})"] },
      { p: "R_{target} = R_{neutral} + \\pi_{exp} + 0.5(\\pi_{exp} - \\pi_{target}) + ", s: "", a: "0.5(Y_{exp} - Y_{trend})", d: ["0.5(Y_{trend} - Y_{exp})", "(Y_{exp} - Y_{trend})", "0.5(\\pi_{exp} - Y_{trend})"] },
      { p: "R_{target} = ", s: " + \\pi_{exp} + 0.5(\\pi_{exp} - \\pi_{target}) + 0.5(Y_{exp} - Y_{trend})", a: "R_{neutral}", d: ["R_{real}", "R_{nominal}", "0"] },
      { p: "", s: " = R_{neutral} + \\pi_{exp} + 0.5(\\Delta \\pi) + 0.5(\\Delta Y)", a: "R_{target}", d: ["R_{real}", "Inflation", "GDP\\ Growth"] }
    ]
  },
  {
    t: "Quant & Econ", c: "Cobb-Douglas Production", n: "Modèle de production. T = TFP.",
    v: [
      { p: "Y = T \\times K^{\\alpha} \\times ", s: "", a: "L^{(1-\\alpha)}", d: ["L^{\\alpha}", "K^{(1-\\alpha)}", "T^{(1-\\alpha)}"] },
      { p: "Y = T \\times ", s: " \\times L^{(1-\\alpha)}", a: "K^{\\alpha}", d: ["K^{(1-\\alpha)}", "L^{\\alpha}", "K"] },
      { p: "Y = ", s: " \\times K^{\\alpha} L^{(1-\\alpha)}", a: "T", d: ["A", "e", "1"] },
      { p: "", s: " = T K^{\\alpha} L^{(1-\\alpha)}", a: "Y", d: ["\\Delta Y", "Growth", "GDP\\ per\\ capita"] }
    ]
  },
  {
    t: "Quant & Econ", c: "Neoclassical Steady State Growth", n: "Croissance du PIB TOTAL.",
    v: [
      { p: "Growth = ", s: " + n", a: "\\frac{\\theta}{1-\\alpha}", d: ["\\frac{\\theta}{\\alpha}", "\\theta(1-\\alpha)", "\\frac{1-\\alpha}{\\theta}"] },
      { p: "Growth = \\frac{\\theta}{1-\\alpha} ", s: "", a: "+ n", d: ["- n", "+ \\alpha", "- \\theta"] },
      { p: "", s: " = \\frac{\\theta}{1-\\alpha} + n", a: "Growth\\ (Total)", d: ["Growth\\ (Per\\ Capita)", "TFP\\ Growth", "Capital\\ Growth"] }
    ]
  },
  {
    t: "Quant & Econ", c: "Labor Productivity Growth", n: "Croissance de la productivité du travail.",
    v: [
      { p: "\\Delta \\text{Labor Prod} = ", s: " + \\Delta \\text{Cap Deepening}", a: "\\Delta \\text{TFP}", d: ["\\Delta \\text{Capital}", "\\Delta \\text{Labor}", "\\alpha \\Delta \\text{TFP}"] },
      { p: "\\Delta \\text{Labor Prod} = \\Delta \\text{TFP} + ", s: "", a: "\\Delta \\text{Cap Deepening}", d: ["\\Delta \\text{Capital}", "\\Delta \\text{Labor}", "\\Delta \\text{TFP}"] },
      { p: "", s: " = \\Delta \\text{TFP} + \\Delta \\text{Cap Deepening}", a: "\\Delta \\text{Labor Prod}", d: ["\\Delta \\text{Econ Growth}", "\\Delta \\text{GDP}", "\\Delta \\text{Capital}"] }
    ]
  },
  {
    t: "Quant & Econ", c: "Potential GDP Growth", n: "Croissance potentielle du PIB basée sur la main-d'œuvre et sa productivité.",
    v: [
      { p: "\\text{Potential GDP Growth} = \\text{Growth in Total Hours Worked} + ", s: "", a: "\\text{Growth in Labor Productivity}", d: ["\\text{Growth in Capital Deepening}", "\\text{Growth in TFP}", "\\text{Inflation}"] },
      { p: "\\text{Potential GDP Growth} = ", s: " + \\text{Growth in Labor Productivity}", a: "\\text{Growth in Total Hours Worked}", d: ["\\text{Growth in Capital}", "\\text{Growth in Population}", "\\text{Growth in TFP}"] },
      { p: "", s: " = \\text{Growth in Total Hours Worked} + \\text{Growth in Labor Productivity}", a: "\\text{Potential GDP Growth}", d: ["\\text{Actual GDP Growth}", "\\text{Labor Productivity Growth}", "\\text{TFP Growth}"] }
    ]
  },
  {
    t: "Quant & Econ", c: "Dickey-Fuller Test (Unit Root)", n: "Test de racine unitaire (non-stationnaire). H0: g=0 (série non stationnaire). Règle : On VEUT rejeter H0 pour prouver la stationnarité.",
    v: [
      { p: "x_t - x_{t-1} = b_0 + ", s: " \\times x_{t-1} + \\epsilon_t", a: "g", d: ["b_1", "1", "(g-1)"] },
      { p: "H_0 \\text{ for Dickey-Fuller: }", s: "", a: "\\text{Unit Root (Non-stationary)}", d: ["\\text{Covariance stationary}", "\\text{Multicollinear}", "\\text{Homoskedastic}"] },
      { p: "\\text{To prove stationarity (DF test): }", s: "", a: "\\text{Reject } H_0", d: ["\\text{Fail to reject } H_0", "\\text{Accept } H_0", "\\text{First differencing}"] }
    ]
  },

  // --- 2. FINANCIAL STATEMENT ANALYSIS (FSA) ---
  {
    t: "FSA", c: "Current Rate Method Exposure", n: "Utilisé quand la monnaie locale est la devise fonctionnelle.",
    v: [
      { p: "\\text{Net Exposure} = \\text{Total Assets} - \\text{Total Liab} = ", s: "", a: "\\text{Total Equity}", d: ["\\text{Monetary Assets}", "\\text{Net Income}", "\\text{Total Assets}"] },
      { p: "\\text{Net Exposure} = ", s: " - \\text{Total Liab}", a: "\\text{Total Assets}", d: ["\\text{Monetary Assets}", "\\text{Current Assets}", "\\text{Fixed Assets}"] }
    ]
  },
  {
    t: "FSA", c: "Temporal Method Exposure", n: "Utilisé quand la monnaie de la société mère est la devise fonctionnelle.",
    v: [
      { p: "\\text{Net Exposure} = ", s: " - \\text{Monetary Liab}", a: "\\text{Monetary Assets}", d: ["\\text{Total Assets}", "\\text{Current Assets}", "\\text{Inventory}"] },
      { p: "\\text{Net Exposure} = \\text{Monetary Assets} - ", s: "", a: "\\text{Monetary Liab}", d: ["\\text{Total Liab}", "\\text{Current Liab}", "\\text{Long Term Debt}"] }
    ]
  },
  {
    t: "FSA", c: "Altman Z-Score (Seuils)", n: "Seuil critique de risque de faillite.",
    v: [
      { p: "\\text{Risque de faillite élevé si : } Z ", s: "", a: "< 1.81", d: ["> 1.81", "> 2.99", "< 0"] },
      { p: "\\text{Zone de sécurité si : } Z ", s: "", a: "> 2.99", d: ["< 1.81", "< 2.99", "> 1.81"] },
      { p: "\\text{Z-Score = } 1.20 \\implies \\text{Risque de faillite } ", s: "", a: "\\text{Élevé}", d: ["\\text{Faible}", "\\text{Modéré}", "\\text{Nul}"] },
      { p: "\\text{Z-Score = } 3.50 \\implies \\text{Risque de faillite } ", s: "", a: "\\text{Faible}", d: ["\\text{Élevé}", "\\text{Modéré}", "\\text{Incertain}"] }
    ]
  },
  {
    t: "FSA", c: "Beneish M-Score (Seuils)", n: "Probabilité de manipulation des résultats.",
    v: [
      { p: "\\text{Manipulation probable si : } M ", s: "", a: "> -1.78", d: ["< -1.78", "> 0", "< 1.81"] },
      { p: "\\text{Pas de manipulation probable si : } M ", s: "", a: "< -1.78", d: ["> -1.78", "< 0", "> 1.81"] },
      { p: "\\text{M-Score = } -1.50 \\implies \\text{Risque de manipulation } ", s: "", a: "\\text{Élevé}", d: ["\\text{Faible}", "\\text{Nul}", "\\text{Incertain}"] },
      { p: "\\text{M-Score = } -2.50 \\implies \\text{Risque de manipulation } ", s: "", a: "\\text{Faible}", d: ["\\text{Élevé}", "\\text{Nul}", "\\text{Incertain}"] }
    ]
  },
  {
    t: "FSA", c: "Funded Status", n: "Statut de financement de la pension.",
    v: [
      { p: "\\text{Funded Status} = \\text{Fair Value of Plan Assets} - ", s: "", a: "\\text{PBO}", d: ["\\text{ABO}", "\\text{VBO}", "\\text{Contributions}"] },
      { p: "\\text{Funded Status} = ", s: " - \\text{PBO}", a: "\\text{Fair Value of Plan Assets}", d: ["\\text{Contributions}", "\\text{Expected Return}", "\\text{Actual Return}"] }
    ]
  },
  {
    t: "FSA", c: "Periodic Pension Cost (P&L - IFRS)", n: "Composante P&L en IFRS.",
    v: [
      { p: "\\text{Cost} = \\text{Current Service} + ", s: " + \\text{Past Service}", a: "\\text{Net Interest}", d: ["\\text{Expected Return}", "\\text{Actuarial Gains}", "\\text{Contributions}"] },
      { p: "\\text{Cost} = ", s: " + \\text{Net Interest} + \\text{Past Service}", a: "\\text{Current Service}", d: ["\\text{Contributions}", "\\text{Benefits Paid}", "\\text{Actuarial Losses}"] }
    ]
  },
  {
    t: "FSA", c: "Periodic Pension Cost (P&L - US GAAP)", n: "Charge de retraite au compte de résultat (P&L) sous US GAAP.",
    v: [
      { p: "\\text{Cost} = \\text{Current Serv} + ", s: " - \\text{Exp. Return} \\pm \\text{Amort}", a: "\\text{Interest Cost}", d: ["\\text{Net Interest}", "\\text{Act. Gains}", "\\text{Contributions}"] },
      { p: "\\text{Cost} = \\text{Current Serv} + \\text{Interest Cost} - ", s: " \\pm \\text{Amort}", a: "\\text{Exp. Return}", d: ["\\text{Actual Return}", "\\text{Contributions}", "\\text{Benefits Paid}"] },
      { p: "\\text{Cost} = \\text{Current Serv} + \\text{Interest Cost} - \\text{Exp. Return} \\pm ", s: "", a: "\\text{Amort}", d: ["\\text{Contributions}", "\\text{Act. Gains}", "\\text{Service Cost}"] }
    ]
  },
  {
    t: "FSA", c: "Total Periodic Pension Cost (TPPC)", n: "Coût économique global des pensions.",
    v: [
      { p: "TPPC = \\text{Employer Contributions} - ", s: "", a: "\\Delta \\text{Funded Status}", d: ["\\Delta \\text{PBO}", "\\Delta \\text{Fair Value}", "\\text{Service Cost}"] },
      { p: "TPPC = ", s: " - \\Delta \\text{Funded Status}", a: "\\text{Employer Contributions}", d: ["\\text{Benefits Paid}", "\\text{Actual Return}", "\\text{Service Cost}"] }
    ]
  },
  {
    t: "FSA", c: "Cash-Flow Based Accruals Ratio", n: "Qualité des résultats (plus bas = meilleur).",
    v: [
      { p: "\\text{Ratio} = \\frac{", s: "}{\\text{Average NOA}}", a: "NI - (CFO + CFI)", d: ["NI - CFO", "CFO - CFI", "NI + CFO"] },
      { p: "\\text{Ratio} = \\frac{NI - (CFO + CFI)}{", s: "}", a: "\\text{Average NOA}", d: ["\\text{Ending NOA}", "\\text{Average Assets}", "\\text{Average Equity}"] }
    ]
  },
  {
    t: "FSA", c: "Balance Sheet Based Accruals Ratio", n: "Accumulation des actifs nets.",
    v: [
      { p: "\\text{Ratio} = \\frac{", s: "}{\\text{Average NOA}}", a: "\\Delta NOA", d: ["\\text{Average NOA}", "\\Delta \\text{Working Cap}", "\\Delta \\text{Equity}"] },
      { p: "\\text{Ratio} = \\frac{\\Delta NOA}{", s: "}", a: "\\text{Average NOA}", d: ["\\text{Ending NOA}", "\\text{Beginning NOA}", "\\text{Total Assets}"] }
    ]
  },
  {
    t: "FSA", c: "DuPont Analysis (3-Part)", n: "Décomposition du ROE en 3 ratios.",
    v: [
      { p: "ROE = \\frac{NI}{Rev} \\times \\frac{Rev}{\\text{Avg Assets}} \\times ", s: "", a: "\\frac{\\text{Avg Assets}}{\\text{Avg Equity}}", d: ["\\frac{Rev}{\\text{Avg Assets}}", "\\frac{NI}{Rev}", "\\frac{EBT}{EBIT}"] },
      { p: "ROE = \\frac{NI}{Rev} \\times ", s: " \\times \\frac{\\text{Avg Assets}}{\\text{Avg Equity}}", a: "\\frac{Rev}{\\text{Avg Assets}}", d: ["\\frac{\\text{Avg Assets}}{Rev}", "\\frac{EBIT}{Rev}", "\\frac{NI}{\\text{Avg Assets}}"] },
      { p: "ROE = ", s: " \\times \\text{Asset Turnover} \\times \\text{Leverage}", a: "\\text{Net Margin}", d: ["\\text{Gross Margin}", "\\text{EBIT Margin}", "\\text{Op Margin}"] }
    ]
  },
  {
    t: "FSA", c: "DuPont Analysis (5-Part)", n: "Décomposition ultime du ROE.",
    v: [
      { p: "ROE = \\frac{NI}{EBT} \\times ", s: " \\times \\frac{EBIT}{Rev} \\times \\text{Turnover} \\times \\text{Leverage}", a: "\\frac{EBT}{EBIT}", d: ["\\frac{EBIT}{Rev}", "\\frac{NI}{EBT}", "\\frac{Rev}{\\text{Avg Assets}}"] },
      { p: "ROE = ", s: " \\times \\frac{EBT}{EBIT} \\times \\frac{EBIT}{Rev} \\dots", a: "\\frac{NI}{EBT}", d: ["\\frac{NI}{Rev}", "\\frac{EBT}{NI}", "\\frac{Rev}{EBT}"] }
    ]
  },
  {
    t: "FSA", c: "Cash Conversion Cycle (CCC)", n: "Le besoin net en fonds de roulement exprimé en jours. Plus il est court, mieux c'est.",
    v: [
      { p: "CCC = ", s: " + DSO - DPO", a: "DOH", d: ["DPO", "WCInv", "FCInv"] },
      { p: "CCC = DOH + ", s: " - DPO", a: "DSO", d: ["DPO", "Payables", "Receivables"] },
      { p: "CCC = DOH + DSO - ", s: "", a: "DPO", d: ["DOH", "DSO", "Inventory"] },
      { p: "", s: " = DOH + DSO - DPO", a: "CCC", d: ["Working Capital", "Operating Cycle", "Net Cycle"] }
    ]
  },
  {
    t: "FSA", c: "Common Equity Tier 1 (CET1) Ratio", n: "Évalue la solvabilité d'une banque. CET1 Capital = Common Equity - Intangibles - Deferred Tax Assets (DTA).",
    v: [
      { p: "CET1\\ Ratio = \\frac{", s: "}{\\text{Total Risk-Weighted Assets}}", a: "\\text{Common Eq} - \\text{Intangibles} - \\text{DTA}", d: ["\\text{Common Eq} + \\text{Intangibles}", "\\text{Common Eq} - \\text{Preferred Stock}", "\\text{Total Assets} - \\text{Intangibles}"] },
      { p: "CET1\\ Ratio = \\frac{\\text{Common Eq} - \\text{Intangibles} - \\text{DTA}}{", s: "}", a: "\\text{Total Risk-Weighted Assets}", d: ["\\text{Total Assets}", "\\text{Average Assets}", "\\text{Total Liabilities}"] },
      { p: "CET1\\ Capital = \\text{Common Equity} - \\text{Intangible Assets} - ", s: "", a: "\\text{Deferred Tax Assets}", d: ["\\text{Deferred Tax Liabilities}", "\\text{Goodwill}", "\\text{Minority Interest}"] }
    ]
  },
  {
    t: "FSA", c: "Cumulative Translation Adjustment (CTA)", n: "Translation Method: Sous la Current Rate Method, l'ajustement (CTA) va directement en Equity (OCI) pour équilibrer le bilan.",
    v: [
      { p: "\\text{Current Rate Method: } \\Delta \\text{CTA} \\rightarrow ", s: "", a: "\\text{Equity (OCI)}", d: ["\\text{Income Statement}", "\\text{Retained Earnings}", "\\text{Assets}"] },
      { p: "\\text{Temporal Method: Remeasurement Gain/Loss} \\rightarrow ", s: "", a: "\\text{Income Statement}", d: ["\\text{Equity (OCI)}", "\\text{CTA}", "\\text{Assets}"] }
    ]
  },
  {
    t: "FSA", c: "Liquidity Coverage Ratio (LCR)", n: "Mesure la capacité d'une banque à survivre à un stress de liquidité de 30 jours (Bâle III). Le LCR doit être > 100%.",
    v: [
      { p: "\\text{LCR} = \\frac{", s: "}{\\text{Net Cash Outflows}}", a: "\\text{High-Quality Liquid Assets}", d: ["\\text{Total Assets}", "\\text{Current Assets}", "\\text{Tier 1 Capital}"] },
      { p: "\\text{LCR} = \\frac{\\text{High-Quality Liquid Assets}}{", s: "}", a: "\\text{Net Cash Outflows}", d: ["\\text{Total Liabilities}", "\\text{Current Liabilities}", "\\text{Short-Term Debt}"] },
      { p: "", s: " = \\frac{\\text{High-Quality Liquid Assets}}{\\text{Net Cash Outflows}}", a: "\\text{LCR}", d: ["\\text{NSFR}", "\\text{CET1 Ratio}", "\\text{Current Ratio}"] }
    ]
  },

  // --- 3. CORPORATE ISSUERS ---
  {
    t: "Corp Issuers", c: "Weighted Average Cost of Capital (WACC)", n: "Coût global du financement.",
    v: [
      { p: "WACC = \\left(\\frac{E}{V}\\right)r_e + ", s: " + \\left(\\frac{P}{V}\\right)r_p", a: "\\left(\\frac{D}{V}\\right)r_d(1-t)", d: ["\\left(\\frac{D}{V}\\right)r_d", "\\left(\\frac{E}{V}\\right)r_e(1-t)", "\\left(\\frac{D}{V}\\right)r_d(t)"] },
      { p: "WACC = ", s: " + \\left(\\frac{D}{V}\\right)r_d(1-t) + \\left(\\frac{P}{V}\\right)r_p", a: "\\left(\\frac{E}{V}\\right)r_e", d: ["\\left(\\frac{E}{V}\\right)r_e(1-t)", "\\left(\\frac{V}{E}\\right)r_e", "r_e"] },
      { p: "", s: " = W_e r_e + W_d r_d(1-t) + W_p r_p", a: "WACC", d: ["\\text{Cost of Equity}", "ROIC", "\\text{Hurdle Rate}"] }
    ]
  },
  {
    t: "Corp Issuers", c: "Modigliani-Miller Prop II (w/ Taxes)", n: "Le coût des actions augmente avec le levier.",
    v: [
      { p: "r_e = r_0 + ", s: "", a: "(r_0 - r_d)(1-t)\\frac{D}{E}", d: ["(r_0 - r_d)\\frac{D}{E}", "(r_0 - r_d)(1-t)\\frac{V}{E}", "(r_e - r_d)(1-t)\\frac{D}{E}"] },
      { p: "r_e = ", s: " + (r_0 - r_d)(1-t)\\frac{D}{E}", a: "r_0", d: ["r_d", "WACC", "r_e(1-t)"] },
      { p: "r_e = r_0 + (r_0 - r_d)", s: "\\frac{D}{E}", a: "(1-t)", d: ["(1+t)", "t", "1"] }
    ]
  },
  {
    t: "Corp Issuers", c: "Expected Dividend (Target Payout)", n: "Modèle de lissage de Lintner.",
    v: [
      { p: "Exp\\ Div = D_0 + [(EPS_1 \\times \\text{Target}) - D_0] \\times ", s: "", a: "\\text{Adj Factor}", d: ["\\text{Target Payout}", "\\text{Growth Rate}", "\\text{Retention Rate}"] },
      { p: "Exp\\ Div = D_0 + [", s: " - D_0] \\times \\text{Adj Factor}", a: "EPS_1 \\times \\text{Target Payout}", d: ["EPS_0 \\times \\text{Target}", "NI_1 \\times \\text{Payout}", "D_1"] },
      { p: "Exp\\ Div = ", s: " + [(EPS_1 \\times \\text{Payout}) - D_0] \\times \\text{Adj}", a: "D_0", d: ["D_1", "EPS_0", "0"] }
    ]
  },
  {
    t: "Corp Issuers", c: "Unlevered Beta (Asset Beta)", n: "Retire l'effet du levier financier.",
    v: [
      { p: "\\beta_U = \\frac{", s: "}{1 + (1-t)\\frac{D}{E}}", a: "\\beta_E", d: ["\\beta_E (1-t)", "\\beta_E \\frac{D}{E}", "1"] },
      { p: "\\beta_U = \\frac{\\beta_E}{", s: "}", a: "1 + (1-t)\\frac{D}{E}", d: ["1 + \\frac{D}{E}", "1 + (1-t)\\frac{E}{D}", "(1-t)\\frac{D}{E}"] }
    ]
  },
  {
    t: "Corp Issuers", c: "Relevered Beta (Project Beta)", n: "Ajoute le levier cible du projet.",
    v: [
      { p: "\\beta_{Project} = ", s: " \\times \\left[ 1 + (1-t)\\frac{D}{E} \\right]", a: "\\beta_U", d: ["\\beta_E", "\\beta_M", "1"] },
      { p: "\\beta_{Project} = \\beta_U \\times \\left[ 1 + ", s: " \\right]", a: "(1-t)\\frac{D}{E}", d: ["(1-t)\\frac{E}{D}", "\\frac{D}{E}", "t\\frac{D}{E}"] }
    ]
  },

  // --- 4. EQUITY VALUATION ---
  {
    t: "Equity", c: "FCFF (from NI)", n: "Flux pour tous les apporteurs de capitaux.",
    v: [
      { p: "FCFF = NI + NCC + ", s: " - FCInv - WCInv", a: "Int(1-t)", d: ["Int", "NCC", "Net\\ Borrowing"] },
      { p: "FCFF = ", s: " + NCC + Int(1-t) - FCInv - WCInv", a: "NI", d: ["EBIT", "CFO", "EBITDA"] },
      { p: "FCFF = NI + ", s: " + Int(1-t) - FCInv - WCInv", a: "NCC", d: ["Depreciation", "Amortization", "CapEx"] },
      { p: "FCFF = NI + NCC + Int(1-t) - ", s: " - WCInv", a: "FCInv", d: ["CapEx", "CFI", "CFO"] }
    ]
  },
  {
    t: "Equity", c: "FCFF (from CFO)", n: "Formule la plus rapide via le CFO.",
    v: [
      { p: "FCFF = CFO + ", s: " - FCInv", a: "Int(1-t)", d: ["CFI", "NCC", "Net\\ Borrowing"] },
      { p: "FCFF = ", s: " + Int(1-t) - FCInv", a: "CFO", d: ["NI", "CFI", "EBITDA"] },
      { p: "FCFF = CFO + Int(1-t) - ", s: "", a: "FCInv", d: ["WCInv", "NCC", "Dividends"] }
    ]
  },
  {
    t: "Equity", c: "FCFF (from EBITDA)", n: "Utilise l'EBITDA et ajoute l'économie d'impôt (tax shield) de l'amortissement.",
    v: [
      { p: "FCFF = ", s: " + Dep \\times t - FCInv - WCInv", a: "EBITDA(1 - t)", d: ["EBITDA", "EBIT(1 - t)", "CFO"] },
      { p: "FCFF = EBITDA(1 - t) + ", s: " - FCInv - WCInv", a: "Dep \\times t", d: ["NCC", "Dep", "Int(1 - t)"] },
      { p: "FCFF = EBITDA(1 - t) + Dep \\times t - ", s: " - WCInv", a: "FCInv", d: ["CapEx", "CFI", "NCC"] }
    ]
  },
  {
    t: "Equity", c: "FCFE (from NI)", n: "Flux pour les actionnaires uniquement.",
    v: [
      { p: "FCFE = NI + NCC - FCInv - WCInv + ", s: "", a: "Net\\ Borrowing", d: ["Int(1-t)", "Principal\\ Repayments", "Dividends"] },
      { p: "FCFE = ", s: " + NCC - FCInv - WCInv + Net\\ Borrowing", a: "NI", d: ["CFO", "FCFF", "EBIT"] },
      { p: "FCFE = NI + NCC - ", s: " - WCInv + Net\\ Borrowing", a: "FCInv", d: ["Int(1-t)", "CapEx", "Dividends"] }
    ]
  },
  {
    t: "Equity", c: "FCFE (from CFO)", n: "CFO au lieu de NI.",
    v: [
      { p: "FCFE = CFO - FCInv + ", s: "", a: "Net\\ Borrowing", d: ["Int(1-t)", "WCInv", "FCFF"] },
      { p: "FCFE = ", s: " - FCInv + Net\\ Borrowing", a: "CFO", d: ["NI", "FCFF", "EBITDA"] },
      { p: "FCFE = CFO - ", s: " + Net\\ Borrowing", a: "FCInv", d: ["WCInv", "NCC", "Int(1-t)"] }
    ]
  },
  {
    t: "Equity", c: "FCFE (from FCFF)", n: "Passage du flux ferme au flux actionnaires.",
    v: [
      { p: "FCFE = FCFF - ", s: " + Net\\ Borrowing", a: "Int(1-t)", d: ["NCC", "WCInv", "FCInv"] },
      { p: "FCFE = ", s: " - Int(1-t) + Net\\ Borrowing", a: "FCFF", d: ["CFO", "NI", "EBIT"] },
      { p: "FCFE = FCFF - Int(1-t) + ", s: "", a: "Net\\ Borrowing", d: ["Principal\\ Repayments", "New\\ Debt", "Dividends"] }
    ]
  },
  {
    t: "Equity", c: "FCFE Coverage Ratio", n: "Mesure la capacité à couvrir les retours aux actionnaires. Un ratio < 1 signifie qu'il faut puiser dans la trésorerie ou s'endetter.",
    v: [
      { p: "\\text{Coverage Ratio} = \\frac{", s: "}{\\text{Dividends} + \\text{Repurchases}}", a: "FCFE", d: ["FCFF", "NI", "CFO"] },
      { p: "\\text{Coverage Ratio} = \\frac{FCFE}{", s: "}", a: "\\text{Dividends} + \\text{Repurchases}", d: ["\\text{Dividends Paid}", "\\text{Interest} + \\text{Dividends}", "\\text{Net Borrowing}"] },
      { p: "", s: " = \\frac{FCFE}{\\text{Dividends} + \\text{Repurchases}}", a: "\\text{FCFE Coverage Ratio}", d: ["\\text{Dividend Payout}", "\\text{Retention Rate}", "\\text{Sustainable Growth}"] }
    ]
  },
  {
    t: "Equity", c: "Firm Value (Constant Growth)", n: "Modèle de Gordon pour FCFF.",
    v: [
      { p: "\\text{Firm Value} = \\frac{FCFF_1}{", s: "}", a: "WACC - g", d: ["r - g", "WACC + g", "r + g"] },
      { p: "\\text{Firm Value} = \\frac{", s: "}{WACC - g}", a: "FCFF_1", d: ["FCFF_0", "FCFE_1", "D_1"] }
    ]
  },
  {
    t: "Equity", c: "Gordon Growth Model", n: "Valorisation des actions (Dividend Discount).",
    v: [
      { p: "V_0 = \\frac{D_0(1+g)}{", s: "}", a: "r - g", d: ["WACC - g", "r + g", "1 + g"] },
      { p: "V_0 = \\frac{", s: "}{r - g}", a: "D_1", d: ["D_0", "E_1", "FCFE_1"] },
      { p: "V_0 = \\frac{", s: "}{r - g}", a: "D_0(1+g)", d: ["D_1(1+g)", "D_0", "D_0(1+r)"] }
    ]
  },
  {
    t: "Equity", c: "H-Model", n: "H = Demi-vie de la période de forte croissance.",
    v: [
      { p: "V_0 = \\frac{D_0(1+g_L)}{r - g_L} + \\frac{", s: "}{r - g_L}", a: "D_0 \\times H \\times (g_S - g_L)", d: ["D_0(g_S - g_L)", "D_1 \\times H(g_S - g_L)", "D_0 \\times H(g_L - g_S)"] },
      { p: "V_0 = \\frac{", s: "}{r - g_L} + \\frac{D_0 H (g_S - g_L)}{r - g_L}", a: "D_0(1+g_L)", d: ["D_1", "D_0(1+g_S)", "D_0"] },
      { p: "V_0 = \\frac{D_0(1+g_L)}{", s: "} + \\frac{D_0 H (g_S - g_L)}{r - g_L}", a: "r - g_L", d: ["r - g_S", "WACC - g_L", "r"] }
    ]
  },
  {
    t: "Equity", c: "PVGO", n: "Valeur des opportunités de croissance.",
    v: [
      { p: "PVGO = P_0 - ", s: "", a: "\\frac{E_1}{r}", d: ["\\frac{E_0}{r}", "\\frac{D_1}{r}", "\\frac{E_1}{r-g}"] },
      { p: "PVGO = ", s: " - \\frac{E_1}{r}", a: "P_0", d: ["V_0", "B_0", "E_1"] },
      { p: "P_0 = \\frac{E_1}{r} + ", s: "", a: "PVGO", d: ["MVA", "RI", "NPV"] }
    ]
  },
  {
    t: "Equity", c: "Justified Trailing P/E", n: "Basé sur les bénéfices passés (E0).",
    v: [
      { p: "\\frac{P_0}{E_0} = \\frac{", s: "}{r - g}", a: "(1-b)(1+g)", d: ["1-b", "(1-b)(1-g)", "(1+b)(1+g)"] },
      { p: "\\frac{P_0}{E_0} = \\frac{(1-b)(1+g)}{", s: "}", a: "r - g", d: ["r + g", "WACC - g", "ROE - g"] }
    ]
  },
  {
    t: "Equity", c: "Justified Leading P/E", n: "Basé sur les bénéfices futurs (E1).",
    v: [
      { p: "\\frac{P_0}{E_1} = \\frac{", s: "}{r - g}", a: "1-b", d: ["(1-b)(1+g)", "1+b", "b"] },
      { p: "\\frac{P_0}{E_1} = \\frac{1-b}{", s: "}", a: "r - g", d: ["r + g", "WACC - g", "ROE - g"] }
    ]
  },
  {
    t: "Equity", c: "Justified P/B Ratio", n: "Justifie la valo comptable.",
    v: [
      { p: "\\frac{P_0}{B_0} = \\frac{", s: "}{r - g}", a: "ROE - g", d: ["r - g", "ROE - r", "1 - g"] },
      { p: "\\frac{P_0}{B_0} = \\frac{ROE - g}{", s: "}", a: "r - g", d: ["r + g", "WACC - g", "ROE - r"] }
    ]
  },
  {
    t: "Equity", c: "Justified P/S Ratio", n: "Relie la marge nette à la valorisation.",
    v: [
      { p: "\\frac{P_0}{S_0} = \\frac{", s: "}{r - g}", a: "\\text{Net Margin} \\times \\text{Payout} \\times (1+g)", d: ["\\text{Gross Margin} \\times \\text{Payout}", "\\text{Net Margin} \\times (1-g)", "\\text{EBIT Margin} \\times \\text{Payout}"] },
      { p: "\\frac{P_0}{S_0} = \\frac{\\text{Net Margin} \\times \\text{Payout} \\times (1+g)}{", s: "}", a: "r - g", d: ["r + g", "WACC - g", "ROE - g"] }
    ]
  },
  {
    t: "Equity", c: "PEG Ratio", n: "Relie la valorisation à la croissance.",
    v: [
      { p: "PEG = \\frac{P/E}{", s: "}", a: "g", d: ["r", "ROE", "1-b"] },
      { p: "PEG = \\frac{", s: "}{g}", a: "P/E", d: ["P/B", "P/S", "Price"] }
    ]
  },
  {
    t: "Equity", c: "Sustainable Growth Rate (g)", n: "Croissance sans émission d'actions.",
    v: [
      { p: "g = ", s: " \\times ROE", a: "(1 - \\text{Payout})", d: ["\\text{Payout}", "(1 - \\text{Retention})", "1"] },
      { p: "g = \\text{Retention Rate} \\times ", s: "", a: "ROE", d: ["ROA", "r", "WACC"] }
    ]
  },
  {
    t: "Equity", c: "Residual Income (RI_t)", n: "Profit économique.",
    v: [
      { p: "RI_t = ", s: " \\times B_{t-1}", a: "(ROE - r)", d: ["(ROE - g)", "(r - g)", "ROE"] },
      { p: "RI_t = (ROE - r) \\times ", s: "", a: "B_{t-1}", d: ["B_t", "E_t", "\\text{Total Assets}"] },
      { p: "RI_t = E_t - ", s: "", a: "(r \\times B_{t-1})", d: ["(WACC \\times B_{t-1})", "(g \\times B_{t-1})", "\\text{Dividends}"] }
    ]
  },
  {
    t: "Equity", c: "Residual Income Model (V_0)", n: "Valeur actuelle = Valeur comptable + RI futurs.",
    v: [
      { p: "V_0 = B_0 + ", s: "", a: "\\sum \\frac{RI_t}{(1+r)^t}", d: ["\\sum \\frac{RI_t}{(1+WACC)^t}", "\\sum \\frac{RI_t}{(r-g)}", "RI_1 / r"] },
      { p: "V_0 = ", s: " + \\sum \\frac{RI_t}{(1+r)^t}", a: "B_0", d: ["P_0", "E_0", "0"] },
      { p: "V_0 = B_0 + \\sum \\frac{RI_t}{", s: "}", a: "(1+r)^t", d: ["(1+WACC)^t", "(r-g)", "(1+ROE)^t"] }
    ]
  },
  {
    t: "Equity", c: "Excess Earnings Method", n: "Modèle de RI à croissance constante.",
    v: [
      { p: "V_0 = B_0 + \\frac{", s: "}{r - g}", a: "B_0 \\times (ROE - r)", d: ["B_0 \\times (ROE - g)", "E_1 - r B_0", "B_0 \\times ROE"] },
      { p: "V_0 = B_0 + \\frac{B_0 \\times (ROE - r)}{", s: "}", a: "r - g", d: ["WACC - g", "r + g", "ROE - g"] }
    ]
  },
  {
    t: "Equity", c: "PV of Continuing Residual Income", n: "Valeur actuelle (en t=0) de la valeur terminale avec un facteur de persistance ω (0 à 1).",
    v: [
      { p: "PV = \\frac{", s: "}{(1 + r - \\omega)(1 + r)^{T-1}}", a: "RI_T", d: ["RI_{T-1}", "TV_{T-1}", "E_T"] },
      { p: "PV = \\frac{RI_T}{(", s: ")(1 + r)^{T-1}}", a: "1 + r - \\omega", d: ["1 + r + \\omega", "r - \\omega", "WACC - g"] },
      { p: "PV = \\frac{RI_T}{(1 + r - \\omega)", s: "}", a: "(1 + r)^{T-1}", d: ["(1 + r)^T", "(1 + r)", "(1 + r)^{T+1}"] }
    ]
  },
  {
    t: "Equity", c: "Market Value Added (MVA)", n: "Création de richesse globale.",
    v: [
      { p: "MVA = \\text{Market Value} - ", s: "", a: "\\text{Book Value}", d: ["\\text{Intrinsic Value}", "\\text{Present Value}", "\\text{Enterprise Value}"] },
      { p: "MVA = ", s: " - \\text{Book Value}", a: "\\text{Market Value}", d: ["\\text{Intrinsic Value}", "\\text{Enterprise Value}", "\\text{Fair Value}"] }
    ]
  },
  {
    t: "Equity", c: "Discount for Lack of Control (DLOC)", n: "Passe d'une valeur de contrôle à une valeur minoritaire en purgeant la prime de contrôle.",
    v: [
      { p: "Value_{Minority} = \\frac{Value_{Control}}{", s: "}", a: "1 + \\text{Control Premium}", d: ["1 - \\text{Control Premium}", "\\text{Control Premium}", "1 + DLOC"] },
      { p: "Value_{Minority} = \\frac{", s: "}{1 + \\text{Control Premium}}", a: "Value_{Control}", d: ["Value_{Minority}", "Value_{Market}", "Value_{Intrinsic}"] },
      { p: "", s: " = \\frac{Value_{Control}}{1 + \\text{Control Premium}}", a: "Value_{Minority}", d: ["Value_{Control}", "DLOC", "Control\\ Premium"] }
    ]
  },
  {
    t: "Equity", c: "Total Discount (DLOC & DLOM)", n: "Calcule la décote totale. Les décotes se composent, elles ne s'additionnent pas !",
    v: [
      { p: "\\text{Total Discount} = 1 - \\left[ (1 - DLOC) \\times ", s: " \\right]", a: "(1 - DLOM)", d: ["DLOM", "(1 + DLOM)", "(1 - DLOC)"] },
      { p: "\\text{Total Discount} = ", s: " - \\left[ (1 - DLOC) \\times (1 - DLOM) \\right]", a: "1", d: ["0", "DLOC", "DLOM"] },
      { p: "", s: " = 1 - \\left[ (1 - DLOC) \\times (1 - DLOM) \\right]", a: "\\text{Total Discount}", d: ["DLOC", "DLOM", "\\text{Control Premium}"] }
    ]
  },
  {
    t: "Equity", c: "Multi-Stage Terminal Value", n: "Valeur terminale calculée à la fin de la phase de forte croissance (t=n). N'oublie pas d'actualiser ensuite !",
    v: [
      { p: "TV_n = \\frac{D_{n+1}}{", s: "}", a: "r - g_{long-term}", d: ["r - g_{short-term}", "WACC - g_{long-term}", "r + g_{long-term}"] },
      { p: "TV_n = \\frac{", s: "}{r - g_{long-term}}", a: "D_{n+1}", d: ["D_n", "D_0", "E_{n+1}"] }
    ]
  },
  {
    t: "Equity", c: "Equity Value & Price per Share", n: "Passage de la valeur de la firme à la valeur des capitaux propres, puis au prix par action. Attention : utiliser la Market Value de la dette !",
    v: [
      { p: "\\text{Equity Value} = \\text{Firm Value} + \\text{NonOp Assets} - ", s: "", a: "\\text{Market Value of Debt}", d: ["\\text{Book Value of Debt}", "\\text{Total Liabilities}", "\\text{Preferred Equity}"] },
      { p: "\\text{Equity Value} = ", s: " + \\text{NonOp Assets} - \\text{Market Value of Debt}", a: "\\text{Firm Value}", d: ["\\text{Net Income}", "\\text{Enterprise Value}", "\\text{Total Assets}"] },
      { p: "\\text{Price} = \\frac{", s: "}{\\text{Shares Outstanding}}", a: "\\text{Equity Value}", d: ["\\text{Firm Value}", "\\text{Enterprise Value}", "\\text{Net Income}"] }
    ]
  },

  // --- 5. FIXED INCOME ---
  {
    t: "Fixed Income", c: "Forward Rate (No-Arbitrage Eq)", n: "Équation fondamentale. (Multiplication !)",
    v: [
      { p: "(1+Z_{Total})^{Total} = (1+Z_{Attente})^{Attente} \\times ", s: "", a: "(1+F_{Attente, Duree})^{Duree}", d: ["(1+F_{Attente, Duree})^{Total}", "(1+Z_{Attente})^{Duree}", "(1+F_{Total, Duree})^{Attente}"] },
      { p: "(1+Z_{Total})^{Total} = ", s: " \\times (1+F_{Attente, Duree})^{Duree}", a: "(1+Z_{Attente})^{Attente}", d: ["(1+Z_{Attente})^{Total}", "(1+Z_{Total})^{Attente}", "1"] },
      { p: "", s: " = (1+Z_{Attente})^{Attente} \\times (1+F_{Attente, Duree})^{Duree}", a: "(1+Z_{Total})^{Total}", d: ["(1+Z_{Total})^{Attente}", "(1+Z_{Attente})^{Total}", "(1+F_{Attente, Total})^{Total}"] }
    ]
  },
  {
    t: "Fixed Income", c: "Binomial Bond Valuation Node", n: "Rétro-induction.",
    v: [
      { p: "V_{\\text{node}} = \\frac{", s: "}{1 + fwd}", a: "0.5(V_{up} + V_{down}) + C", d: ["0.5(V_{up} + V_{down})", "V_{up} + V_{down} + C", "0.5(V_{up} - V_{down}) + C"] },
      { p: "V_{\\text{node}} = \\frac{0.5(V_{up} + V_{down}) + C}{", s: "}", a: "1 + fwd", d: ["1 + z", "1 + WACC", "1 + YTM"] }
    ]
  },
  {
    t: "Fixed Income", c: "Value of Callable Bond", n: "Option pour l'émetteur.",
    v: [
      { p: "V_{\\text{callable}} = ", s: " - V_{\\text{call}}", a: "V_{\\text{straight}}", d: ["V_{\\text{putable}}", "\\text{Par Value}", "V_{\\text{node}}"] },
      { p: "V_{\\text{callable}} = V_{\\text{straight}} - ", s: "", a: "V_{\\text{call}}", d: ["V_{\\text{put}}", "\\text{Premium}", "\\text{Discount}"] }
    ]
  },
  {
    t: "Fixed Income", c: "Value of Putable Bond", n: "Option pour l'investisseur.",
    v: [
      { p: "V_{\\text{putable}} = ", s: " + V_{\\text{put}}", a: "V_{\\text{straight}}", d: ["V_{\\text{callable}}", "\\text{Par Value}", "V_{\\text{node}}"] },
      { p: "V_{\\text{putable}} = V_{\\text{straight}} + ", s: "", a: "V_{\\text{put}}", d: ["V_{\\text{call}}", "\\text{Premium}", "\\text{Discount}"] }
    ]
  },
  {
    t: "Fixed Income", c: "Effective Duration", n: "Mesure du risque de taux pour obligations complexes.",
    v: [
      { p: "\\text{EffDur} = \\frac{", s: "}{2 \\times \\Delta y \\times V_0}", a: "PV_- - PV_+", d: ["PV_+ - PV_-", "PV_- + PV_+", "PV_+ + PV_-"] },
      { p: "\\text{EffDur} = \\frac{PV_- - PV_+}{", s: "}", a: "2 \\times \\Delta y \\times V_0", d: ["\\Delta y \\times V_0", "2 \\times \\Delta y", "(\\Delta y)^2 \\times V_0"] }
    ]
  },
  {
    t: "Fixed Income", c: "Effective Convexity", n: "Ajustement non linéaire.",
    v: [
      { p: "\\text{EffCon} = \\frac{", s: "}{(\\Delta y)^2 \\times V_0}", a: "PV_- + PV_+ - 2PV_0", d: ["PV_- - PV_+ - 2PV_0", "PV_+ - PV_- - 2PV_0", "2PV_0 - PV_- - PV_+"] },
      { p: "\\text{EffCon} = \\frac{PV_- + PV_+ - 2PV_0}{", s: "}", a: "(\\Delta y)^2 \\times V_0", d: ["2 \\times \\Delta y \\times V_0", "(\\Delta y) \\times V_0", "2 \\times (\\Delta y)^2 \\times V_0"] }
    ]
  },
  {
    t: "Fixed Income", c: "Credit Valuation Adjustment (CVA)", n: "Valeur du risque de crédit.",
    v: [
      { p: "CVA = \\sum (", s: " \\times DF)", a: "EE \\times LGD \\times PD", d: ["EE \\times LGD", "LGD \\times PD", "EE \\times PD"] },
      { p: "CVA = \\sum (EE \\times LGD \\times PD \\times ", s: ")", a: "DF", d: ["1+r", "e^{-r}", "WACC"] }
    ]
  },
  {
    t: "Fixed Income", c: "CDS Upfront Premium", n: "Payé à l'initiation.",
    v: [
      { p: "\\text{Upfront} = (", s: ") \\times \\text{Dur}_{CDS}", a: "\\text{Spread} - \\text{Fixed coupon}", d: ["\\text{Fixed coupon} - \\text{Spread}", "\\text{Spread} + \\text{Fixed coupon}", "\\text{Spread} \\times \\text{Fixed coupon}"] },
      { p: "\\text{Upfront} = (\\text{Spread} - \\text{Fixed coupon}) \\times ", s: "", a: "\\text{Dur}_{CDS}", d: ["\\text{Notional}", "DF", "PD"] }
    ]
  },
  {
    t: "Fixed Income", c: "P/L for Protection Buyer", n: "Gain si le spread s'élargit.",
    v: [
      { p: "P/L = ", s: " \\times \\text{Notional}", a: "\\Delta \\text{Spread} \\times \\text{Dur}_{CDS}", d: ["\\text{Spread} \\times \\text{Dur}_{CDS}", "\\Delta \\text{Spread} \\times \\text{Notional}", "\\text{Dur}_{CDS} \\times \\text{Notional}"] },
      { p: "P/L = \\Delta \\text{Spread} \\times \\text{Dur}_{CDS} \\times ", s: "", a: "\\text{Notional}", d: ["100", "DF", "LGD"] }
    ]
  },
  {
    t: "Fixed Income", c: "Market Conversion Premium Ratio", n: "Prime payée par rapport à la valeur en actions de l'obligation convertible.",
    v: [
      { p: "\\text{Market Premium Ratio} = \\frac{", s: "}{\\text{Conversion Value}}", a: "\\text{Convertible Bond Price} - \\text{Conversion Value}", d: ["\\text{Conversion Value} - \\text{Convertible Bond Price}", "\\text{Convertible Bond Price}", "\\text{Market Price}"] },
      { p: "\\text{Market Premium Ratio} = \\frac{\\text{Convertible Bond Price} - \\text{Conversion Value}}{", s: "}", a: "\\text{Conversion Value}", d: ["\\text{Convertible Bond Price}", "\\text{Par Value}", "\\text{Straight Value}"] }
    ]
  },
  {
    t: "Fixed Income", c: "Expected Loss & LGD", n: "LGD est la perte en cas de défaut, complémentaire du taux de recouvrement. (Credit Risk Calc)",
    v: [
      { p: "\\text{Expected Loss} = \\text{Exposure} \\times \\text{PD} \\times ", s: "", a: "\\text{LGD}", d: ["\\text{Recovery Rate}", "(1 - \\text{PD})", "\\text{CVA}"] },
      { p: "\\text{LGD} = 1 - ", s: "", a: "\\text{Recovery Rate}", d: ["\\text{PD}", "\\text{Survival Rate}", "\\text{Expected Loss}"] }
    ]
  },

  // --- 6. DERIVATIVES ---
  {
    t: "Derivatives", c: "FRA Rate (via PV factors)", n: "Sécurise un taux d'intérêt futur (Pont temporel entre h et h+m).",
    v: [
      { p: "FRA(0, h, m) = \\left( ", s: " - 1 \\right) \\times \\frac{360}{m}", a: "\\frac{PV_h}{PV_{h+m}}", d: ["\\frac{PV_{h+m}}{PV_h}", "PV_h - PV_{h+m}", "\\frac{PV_h}{PV_m}"] },
      { p: "FRA(0, h, m) = \\left( \\frac{PV_h}{PV_{h+m}} - 1 \\right) \\times ", s: "", a: "\\frac{360}{m}", d: ["\\frac{m}{360}", "\\frac{360}{h+m}", "\\frac{360}{h}"] },
      { p: "FRA(0, h, m) = ", s: "", a: "\\left( \\frac{PV_h}{PV_{h+m}} - 1 \\right) \\times \\frac{360}{m}", d: ["\\left( \\frac{PV_{h+m}}{PV_h} - 1 \\right) \\times \\frac{360}{m}", "\\left( \\frac{PV_h}{PV_{h+m}} \\right) \\times \\frac{m}{360}"] }
    ]
  },
  {
    t: "Derivatives", c: "FRA Rate (via Spot Rates)", n: "Calcule le taux FRA en utilisant les taux spot long (R_L) et court (R_S). Ne pas oublier de réannualiser à la fin !",
    v: [
      { p: "FRA = \\left[ \\frac{", s: "}{1 + R_S \\times \\left( \\frac{D_S}{360} \\right)} - 1 \\right] \\times \\frac{360}{D_L - D_S}", a: "1 + R_L \\times \\left( \\frac{D_L}{360} \\right)", d: ["1 + R_L \\times \\left( \\frac{D_S}{360} \\right)", "1 + R_S \\times \\left( \\frac{D_L}{360} \\right)", "R_L \\times \\left( \\frac{D_L}{360} \\right)"] },
      { p: "FRA = \\left[ \\frac{1 + R_L \\times \\left( \\frac{D_L}{360} \\right)}{", s: "} - 1 \\right] \\times \\frac{360}{D_L - D_S}", a: "1 + R_S \\times \\left( \\frac{D_S}{360} \\right)", d: ["1 + R_L \\times \\left( \\frac{D_S}{360} \\right)", "1 + R_S \\times \\left( \\frac{D_L}{360} \\right)", "R_S \\times \\left( \\frac{D_S}{360} \\right)"] },
      { p: "FRA = \\left[ \\frac{1 + R_L \\times \\left( \\frac{D_L}{360} \\right)}{1 + R_S \\times \\left( \\frac{D_S}{360} \\right)} - 1 \\right] \\times ", s: "", a: "\\frac{360}{D_L - D_S}", d: ["\\frac{D_L - D_S}{360}", "\\frac{360}{D_L}", "\\frac{360}{D_S}"] }
    ]
  },
  {
    t: "Derivatives", c: "Bond Forward/Futures Price", n: "Le Sac à dos : (Prix Plein × Taux) - Coupons - AI final, le tout divisé par le Facteur de Conversion (CF).",
    v: [
      { p: "F_0 = ", s: " \\times \\left[ (S_0 + AI_0)\\left(1 + R_f \\times \\frac{jours}{360}\\right) - FV(Coupons) - AI_T \\right]", a: "\\frac{1}{CF}", d: ["CF", "\\frac{1}{1+R_f}", "(1-CF)"] },
      { p: "F_0 = \\frac{1}{CF} \\times \\left[ ", s: " \\times \\left(1 + R_f \\times \\frac{jours}{360}\\right) - FV(Coupons) - AI_T \\right]", a: "(S_0 + AI_0)", d: ["S_0", "(S_0 - AI_0)", "(S_T + AI_T)"] },
      { p: "F_0 = \\frac{1}{CF} \\times \\left[ (S_0 + AI_0)\\left(1 + R_f \\times \\frac{jours}{360}\\right) - FV(Coupons) - ", s: " \\right]", a: "AI_T", d: ["AI_0", "CF", "PV(Coupons)"] }
    ]
  },
  {
    t: "Derivatives", c: "Calendar Spread", n: "Le Billet de Train : Départ proche vs lointain. Spread négatif = Contango. Spread positif = Backwardation.",
    v: [
      { p: "Calendar\\ Spread = ", s: " - F_{Farther}", a: "F_{Near}", d: ["F_{Farther}", "S_0", "F_{Near} + F_{Farther}"] },
      { p: "Calendar\\ Spread = F_{Near} - ", s: "", a: "F_{Farther}", d: ["F_{Near}", "S_0", "F_{Near} + F_{Farther}"] },
      { p: "Spread < 0 \\implies F_{Farther} > F_{Near} \\implies ", s: "", a: "\\text{Contango}", d: ["\\text{Backwardation}", "\\text{Normal Market}", "\\text{Arbitrage}"] },
      { p: "Spread > 0 \\implies F_{Near} > F_{Farther} \\implies ", s: "", a: "\\text{Backwardation}", d: ["\\text{Contango}", "\\text{Normal Market}", "\\text{Arbitrage}"] }
    ]
  },
  {
    t: "Derivatives", c: "Mark-to-Market FX Forward", n: "Le Ticket de Caisse Différé : (Nouveau Forward - Ancien) × Notionnel, actualisé au taux de la devise 'Price'.",
    v: [
      { p: "V_{mtm} = \\frac{", s: "}{1 + R_{price} \\times \\frac{jours_{restants}}{360}}", a: "(F_t - F_0) \\times Notionnel", d: ["(F_0 - F_t) \\times Notionnel", "(S_t - F_0) \\times Notionnel", "F_t \\times Notionnel"] },
      { p: "V_{mtm} = \\frac{(F_t - F_0) \\times Notionnel}{", s: "}", a: "1 + R_{price} \\times \\frac{jours_{restants}}{360}", d: ["1 + R_{price} \\times \\frac{T_{total}}{360}", "(1 + R_{price})^{jours/360}", "1 + R_{base} \\times \\frac{jours_{restants}}{360}"] },
      { p: "V_{mtm} = \\frac{(F_t - F_0) \\times Notionnel}{1 + ", s: " \\times \\frac{jours_{restants}}{360}}", a: "R_{price}", d: ["R_{base}", "R_{domestic}", "WACC"] }
    ]
  },
  {
    t: "Derivatives", c: "Put-Call Parity", n: "Relation avec le Spot.",
    v: [
      { p: "c + \\frac{X}{(1+R_f)^T} = ", s: "", a: "p + S_0", d: ["c + S_0", "p - S_0", "c - S_0"] },
      { p: "c + ", s: " = p + S_0", a: "\\frac{X}{(1+R_f)^T}", d: ["X(1+R_f)^T", "\\frac{S_0}{(1+R_f)^T}", "X"] }
    ]
  },
  {
    t: "Derivatives", c: "Put-Call Forward Parity", n: "Relation avec le Forward.",
    v: [
      { p: "c + \\frac{X}{(1+R_f)^T} = p + ", s: "", a: "\\frac{F_0}{(1+R_f)^T}", d: ["F_0(1+R_f)^T", "S_0(1+R_f)^T", "\\frac{S_0}{(1+R_f)^T}"] },
      { p: "c - p = ", s: "", a: "\\frac{F_0 - X}{(1+R_f)^T}", d: ["\\frac{X - F_0}{(1+R_f)^T}", "F_0 - X", "S_0 - X"] }
    ]
  },
  {
    t: "Derivatives", c: "Forward Price (F_0)", n: "Prix d'équilibre fixé à l'initiation.",
    v: [
      { p: "F_0 = (", s: ") \\times (1+R_f)^T", a: "S_0 - PV_{Ben} + PV_{Cost}", d: ["S_0 + PV_{Ben} - PV_{Cost}", "F_0 - PV_{Ben} + PV_{Cost}", "S_0 - PV_{Cost} + PV_{Ben}"] },
      { p: "F_0 = (S_0 - PV_{Ben} + PV_{Cost}) \\times ", s: "", a: "(1+R_f)^T", d: ["(1+R_f)^{-T}", "(1-R_f)^T", "e^{-rT}"] }
    ]
  },
  {
    t: "Derivatives", c: "Value of a Forward (via Spot)", n: "Valeur MTM en cours de vie.",
    v: [
      { p: "V_t = S_t - PV_{Ben} + PV_{Cost} - ", s: "", a: "\\frac{F_0}{(1+R_f)^{T-t}}", d: ["F_0(1+R_f)^{T-t}", "\\frac{S_t}{(1+R_f)^{T-t}}", "S_t(1+R_f)^{T-t}"] },
      { p: "V_t = ", s: " - \\frac{F_0}{(1+R_f)^{T-t}}", a: "S_t - PV_{Ben} + PV_{Cost}", d: ["S_0 - PV_{Ben} + PV_{Cost}", "F_t", "F_0"] }
    ]
  },
  {
    t: "Derivatives", c: "Value of a Forward (via New Forward)", n: "Raccourci MTM (très utile).",
    v: [
      { p: "V_t = \\frac{", s: "}{(1+R_f)^{T-t}}", a: "F_t - F_0", d: ["F_0 - F_t", "S_t - S_0", "S_0 - S_t"] },
      { p: "V_t = \\frac{F_t - F_0}{", s: "}", a: "(1+R_f)^{T-t}", d: ["(1+R_f)^T", "(1+R_f)^t", "(1-R_f)^{T-t}"] }
    ]
  },
  {
    t: "Derivatives", c: "Swap Fixed Rate", n: "Taux fixe d'équilibre.",
    v: [
      { p: "r_{fix} = ", s: "", a: "\\frac{1 - PV_n}{\\sum PV_i}", d: ["\\frac{PV_n}{\\sum PV_i}", "\\frac{1 + PV_n}{\\sum PV_i}", "\\frac{1 - PV_n}{PV_i}"] },
      { p: "r_{fix} = \\frac{", s: "}{\\sum PV_i}", a: "1 - PV_n", d: ["PV_n - 1", "1 + PV_n", "1"] },
      { p: "r_{fix} = \\frac{1 - PV_n}{", s: "}", a: "\\sum PV_i", d: ["PV_n", "n", "1 - PV_i"] }
    ]
  },
  {
    t: "Derivatives", c: "Value of a Swap", n: "Valeur MTM du swap (Pay Fixed).",
    v: [
      { p: "V_{swap} = NA \\times ", s: " \\times \\sum PV_i", a: "(FS_t - FS_0)", d: ["(FS_0 - FS_t)", "(FS_0 + FS_t)", "(1 - FS_t)"] },
      { p: "V_{swap} = NA \\times (FS_t - FS_0) \\times ", s: "", a: "\\sum PV_i", d: ["PV_n", "1 - PV_n", "\\text{Dur}_{swap}"] }
    ]
  },
  {
    t: "Derivatives", c: "Value of a Swap (Bond Method)", n: "Valorise la jambe fixe comme une obligation et la jambe flottante à 1 (au pair). Formule pour le Receveur Fixe.",
    v: [
      { p: "V_{swap} = NA \\times \\left[ \\left( \\sum_{i=1}^{n} R_{fixed} \\times PV_i \\right) + PV_n - ", s: " \\right]", a: "1", d: ["0", "PV_1", "R_{float}"] },
      { p: "V_{swap} = NA \\times \\left[ \\left( \\sum_{i=1}^{n} R_{fixed} \\times PV_i \\right) + ", s: " - 1 \\right]", a: "PV_n", d: ["PV_1", "R_{fixed}", "1"] },
      { p: "V_{swap} = NA \\times \\left[ \\left( \\sum_{i=1}^{n} ", s: " \\times PV_i \\right) + PV_n - 1 \\right]", a: "R_{fixed}", d: ["R_{float}", "1", "NA"] }
    ]
  },
  {
    t: "Derivatives", c: "BSM Call Option", n: "Modèle Black-Scholes-Merton.",
    v: [
      { p: "C = S \\times N(d_1) - ", s: "", a: "e^{-rt}X \\times N(d_2)", d: ["e^{-rt}X \\times N(d_1)", "S \\times N(d_2)", "S \\times N(-d_1)"] },
      { p: "C = ", s: " - e^{-rt}X \\times N(d_2)", a: "S \\times N(d_1)", d: ["S \\times N(d_2)", "X \\times N(d_1)", "S \\times N(-d_1)"] }
    ]
  },
  {
    t: "Derivatives", c: "BSM Put Option", n: "Dérivé de Put-Call Parity.",
    v: [
      { p: "P = ", s: " - S \\times N(-d_1)", a: "e^{-rt}X \\times N(-d_2)", d: ["e^{-rt}X \\times N(-d_1)", "S \\times N(-d_2)", "S \\times N(d_1)"] },
      { p: "P = e^{-rt}X \\times N(-d_2) - ", s: "", a: "S \\times N(-d_1)", d: ["S \\times N(d_1)", "X \\times N(-d_1)", "S \\times N(-d_2)"] }
    ]
  },
  {
    t: "Derivatives", c: "Binomial Model: Up Factor", n: "Facteur u.",
    v: [
      { p: "u = ", s: ", \\quad d = \\frac{1}{u}", a: "e^{\\sigma \\sqrt{\\Delta t}}", d: ["e^{\\sigma \\Delta t}", "e^{\\sigma^2 \\sqrt{\\Delta t}}", "e^{\\sqrt{\\sigma \\Delta t}}"] },
      { p: "u = e^{\\sigma \\sqrt{\\Delta t}}, \\quad d = ", s: "", a: "\\frac{1}{u}", d: ["-u", "1 - u", "e^{-\\sigma}"] }
    ]
  },
  {
    t: "Derivatives", c: "Binomial Model: Risk-Neutral Prob.", n: "Probabilité risque-neutre de hausse.",
    v: [
      { p: "\\pi_U = \\frac{", s: "}{u - d}", a: "FV(1) - d", d: ["FV(1) - u", "1 - d", "u - FV(1)"] },
      { p: "\\pi_U = \\frac{FV(1) - d}{", s: "}", a: "u - d", d: ["u + d", "1 - d", "u - 1"] }
    ]
  },
  {
    t: "Derivatives", c: "Binomial Model: Hedge Ratio", n: "Delta.",
    v: [
      { p: "h = \\frac{", s: "}{S_+ - S_-}", a: "c_+ - c_-", d: ["c_+ + c_-", "S_+ - S_-", "p_+ - S_-"] },
      { p: "h = \\frac{c_+ - c_-}{", s: "}", a: "S_+ - S_-", d: ["S_+ + S_-", "c_+ - c_-", "u - d"] }
    ]
  },
  {
    t: "Derivatives", c: "Equity Swap Value", n: "Valeur d'un swap payeur fixe / receveur action.",
    v: [
      { p: "V_{\\text{Swap}} = ", s: "", a: "V_{\\text{Equity Leg}} - V_{\\text{Fixed Leg}}", d: ["V_{\\text{Fixed Leg}} - V_{\\text{Equity Leg}}", "V_{\\text{Equity Leg}} + V_{\\text{Fixed Leg}}"] },
      { p: "V_{\\text{Swap}} = ", s: " - V_{\\text{Fixed Leg}}", a: "V_{\\text{Equity Leg}}", d: ["V_{\\text{Float Leg}}", "\\text{Notional}", "S_t / S_{t-\\text{last}}"] },
      { p: "V_{\\text{Swap}} = V_{\\text{Equity Leg}} - ", s: "", a: "V_{\\text{Fixed Leg}}", d: ["V_{\\text{Float Leg}}", "\\text{Notional}", "PV_{\\text{last}}"] }
    ]
  },
  {
    t: "Derivatives", c: "Equity Swap - Equity Leg", n: "Valeur de la jambe action (S_t: actuel, S_{t-last}: dernier reset).",
    v: [
      { p: "V_{\\text{Equity Leg}} = ", s: " \\times \\text{Notional}", a: "\\left( \\frac{S_t}{S_{t-\\text{last}}} \\right)", d: ["\\left( \\frac{S_{t-\\text{last}}}{S_t} \\right)", "(S_t - S_{t-\\text{last}})", "\\left( \\frac{S_t - S_{t-\\text{last}}}{S_t} \\right)"] },
      { p: "V_{\\text{Equity Leg}} = \\left( \\frac{", s: "}{S_{t-\\text{last}}} \\right) \\times \\text{Notional}", a: "S_t", d: ["S_{t-\\text{last}}", "S_0", "F_t"] },
      { p: "V_{\\text{Equity Leg}} = \\left( \\frac{S_t}{", s: "} \\right) \\times \\text{Notional}", a: "S_{t-\\text{last}}", d: ["S_t", "S_0", "F_0"] }
    ]
  },
  {
    t: "Derivatives", c: "Equity Swap - Fixed Leg", n: "Valeur de la jambe fixe après l'initiation.",
    v: [
      { p: "V_{\\text{Fixed Leg}} = \\left( ", s: " + 1 \\times PV_{\\text{last}} \\right) \\times \\text{Notional}", a: "\\text{Fixed Rate} \\times \\sum PV_{\\text{factors}}", d: ["\\text{Float Rate} \\times \\sum PV_{\\text{factors}}", "\\text{Fixed Rate} \\times PV_{\\text{last}}", "1 - PV_{\\text{last}}"] },
      { p: "V_{\\text{Fixed Leg}} = \\left( \\text{Fixed Rate} \\times \\sum PV_{\\text{factors}} + ", s: " \\right) \\times \\text{Notional}", a: "1 \\times PV_{\\text{last}}", d: ["PV_{\\text{factors}}", "1 \\times PV_1", "\\text{Notional}"] }
    ]
  },

  // --- 7. ALTERNATIVE INVESTMENTS ---
  {
    t: "Alts", c: "Capitalization Rate (Real Estate)", n: "Yield de l'immobilier.",
    v: [
      { p: "\\text{Cap Rate} = \\frac{", s: "}{\\text{Value}}", a: "NOI_1", d: ["NOI_0", "NI_1", "FFO_1"] },
      { p: "\\text{Cap Rate} = \\frac{NOI_1}{", s: "}", a: "\\text{Value}", d: ["\\text{Price}", "\\text{Equity}", "\\text{Debt}"] },
      { p: "\\text{Value} = \\frac{", s: "}{\\text{Cap Rate}}", a: "NOI_1", d: ["NOI_0", "FFO_1", "AFFO_1"] }
    ]
  },
  {
    t: "Alts", c: "Net Operating Income (NOI)", n: "Revenu avant impôts, intérêts, dépréciation.",
    v: [
      { p: "NOI = \\text{Gross Rev} - \\text{Vacancy} - ", s: "", a: "\\text{Operating Expenses}", d: ["\\text{Interest Expenses}", "\\text{Taxes}", "\\text{Depreciation}"] },
      { p: "NOI = ", s: " - \\text{Vacancy} - \\text{Operating Expenses}", a: "\\text{Gross Rev}", d: ["\\text{Net Rev}", "EBITDA", "FFO"] }
    ]
  },
  {
    t: "Alts", c: "Funds From Operations (FFO)", n: "Métrique de flux pour les REITs.",
    v: [
      { p: "FFO = NI + D\\&A - ", s: "", a: "\\text{Net Gain on Sales}", d: ["\\text{Operating Expenses}", "\\text{Interest Expenses}", "\\text{Dividends}"] },
      { p: "FFO = ", s: " + D\\&A - \\text{Net Gain on Sales}", a: "NI", d: ["NOI", "CFO", "EBITDA"] },
      { p: "FFO = NI + ", s: " - \\text{Net Gain on Sales}", a: "D\\&A", d: ["CapEx", "\\text{Working Capital}", "\\text{Taxes}"] }
    ]
  },
  {
    t: "Alts", c: "Adjusted FFO (AFFO)", n: "Plus précis (liquide) que le FFO.",
    v: [
      { p: "AFFO = FFO - \\text{NonCash Rent} - ", s: "", a: "\\text{Recurring Capex}", d: ["\\text{Interest Expenses}", "\\text{Taxes}", "\\text{Dividends}"] },
      { p: "AFFO = ", s: " - \\text{NonCash Rent} - \\text{Recurring Capex}", a: "FFO", d: ["NOI", "NI", "CFO"] }
    ]
  },
  {
    t: "Alts", c: "REIT NAVPS", n: "Net Asset Value per Share.",
    v: [
      { p: "NAVPS = \\frac{", s: "}{\\text{Shares}}", a: "(NOI / \\text{Cap Rate}) + \\text{Cash} - \\text{Debt}", d: ["(NOI / \\text{Cap Rate}) - \\text{Cash} + \\text{Debt}", "(NOI / \\text{Cap Rate})", "(FFO / \\text{Cap Rate}) + \\text{Cash} - \\text{Debt}"] },
      { p: "NAV = ", s: " + \\text{Cash} - \\text{Debt}", a: "(NOI / \\text{Cap Rate})", d: ["(FFO / \\text{Cap Rate})", "(AFFO / \\text{Cap Rate})", "\\text{Gross Value}"] }
    ]
  },
  {
    t: "Alts", c: "VC Post-Money Valuation", n: "Valeur de la startup après injection.",
    v: [
      { p: "POST = ", s: " + \\text{Investment}", a: "PRE", d: ["NAV", "\\text{Equity}", "\\text{Debt}"] },
      { p: "POST = PRE + ", s: "", a: "\\text{Investment}", d: ["\\text{Debt}", "\\text{Cash}", "\\text{Retained Earnings}"] },
      { p: "PRE = ", s: " - \\text{Investment}", a: "POST", d: ["\\text{Value}", "\\text{Equity}", "\\text{Assets}"] }
    ]
  },
  {
    t: "Alts", c: "VC Fractional Ownership", n: "Pourcentage de détention acquis.",
    v: [
      { p: "f = \\frac{", s: "}{POST}", a: "\\text{Investment}", d: ["PRE", "POST", "\\text{Shares}"] },
      { p: "f = \\frac{\\text{Investment}}{", s: "}", a: "POST", d: ["PRE", "PRE + \\text{Debt}", "\\text{Equity}"] }
    ]
  },
  {
    t: "Alts", c: "Commodities Roll Return", n: "Rendement généré par le roulement des contrats à terme.",
    v: [
      { p: "\\text{Roll Return} = \\frac{", s: "}{\\text{Expiring Price}}", a: "\\text{Expiring Price} - \\text{New Price}", d: ["\\text{New Price} - \\text{Expiring Price}", "\\text{Spot Price} - \\text{New Price}", "\\text{New Price}"] },
      { p: "\\text{Roll Return} = \\frac{\\text{Expiring Price} - \\text{New Price}}{", s: "}", a: "\\text{Expiring Price}", d: ["\\text{New Price}", "\\text{Spot Price}", "\\text{Average Price}"] }
    ]
  },

  // --- 8. PORTFOLIO MANAGEMENT ---
  {
    t: "Portfolio Mgt", c: "Sharpe Ratio (SR)", n: "Rendement ajusté au risque total.",
    v: [
      { p: "SR = \\frac{R_p - R_f}{", s: "}", a: "\\sigma_p", d: ["\\beta_p", "\\sigma_B", "\\sigma_{p-B}"] },
      { p: "SR = \\frac{", s: "}{\\sigma_p}", a: "R_p - R_f", d: ["R_p - R_B", "R_A", "R_p"] }
    ]
  },
  {
    t: "Portfolio Mgt", c: "Treynor Ratio (TR)", n: "Rendement ajusté au risque systématique.",
    v: [
      { p: "TR = \\frac{R_p - R_f}{", s: "}", a: "\\beta_p", d: ["\\sigma_p", "\\beta_B", "\\sigma_{p-B}"] },
      { p: "TR = \\frac{", s: "}{\\beta_p}", a: "R_p - R_f", d: ["R_p - R_B", "R_p", "R_A"] }
    ]
  },
  {
    t: "Portfolio Mgt", c: "Sortino Ratio", n: "Ne pénalise que la volatilité à la baisse (downside risk), utile pour les rendements asymétriques.",
    v: [
      { p: "Sortino = \\frac{R_p - R_{target}}{", s: "}", a: "\\sigma_{downside}", d: ["\\sigma_p", "\\beta_p", "\\sigma_{p-B}"] },
      { p: "Sortino = \\frac{", s: "}{\\sigma_{downside}}", a: "R_p - R_{target}", d: ["R_p - R_f", "R_p - R_B", "E(R_A)"] },
      { p: "", s: " = \\frac{R_p - R_{target}}{\\sigma_{downside}}", a: "Sortino", d: ["Sharpe", "Treynor", "Information"] }
    ]
  },
  {
    t: "Portfolio Mgt", c: "Information Ratio (IR)", n: "Performance active sur risque actif.",
    v: [
      { p: "IR = \\frac{R_p - R_b}{", s: "} = \\frac{R_p - R_b}{\\sigma_{p-b}}", a: "\\text{Active Risk}", d: ["\\text{Total Risk}", "\\text{Market Risk}", "\\text{Systematic Risk}"] },
      { p: "IR = \\frac{R_p - R_b}{\\text{Active Risk}} = \\frac{", s: "}{\\sigma_{p-b}}", a: "R_p - R_b", d: ["R_p - R_f", "R_A - R_f", "R_p"] },
      { p: "IR = \\frac{R_p - R_b}{\\text{Active Risk}} = \\frac{R_p - R_b}{", s: "}", a: "\\sigma_{p-b}", d: ["\\sigma_p", "\\beta_p", "\\sigma_B"] }
    ]
  },
  {
    t: "Portfolio Mgt", c: "Fundamental Law of Active Mgt", n: "Talent x Opportunité x Exécution.",
    v: [
      { p: "IR = TC \\times IC \\times ", s: "", a: "\\sqrt{BR}", d: ["BR", "\\sigma_A", "\\sqrt{TC}"] },
      { p: "IR = ", s: " \\times IC \\times \\sqrt{BR}", a: "TC", d: ["\\sigma_A", "SR_B", "1"] },
      { p: "IR = TC \\times ", s: " \\times \\sqrt{BR}", a: "IC", d: ["\\sigma_A", "IR", "SR_B"] }
    ]
  },
  {
    t: "Portfolio Mgt", c: "Expected Active Return", n: "IR fois Risque Actif.",
    v: [
      { p: "E(R_A) = IR \\times ", s: "", a: "\\sigma_A", d: ["\\sigma_B", "TC", "IC"] },
      { p: "E(R_A) = ", s: " \\times \\sigma_A", a: "IR", d: ["SR", "IC", "TC"] }
    ]
  },
  {
    t: "Portfolio Mgt", c: "Optimal Active Risk", n: "Pour maximiser le SR global.",
    v: [
      { p: "\\sigma_A^* = \\frac{IR}{", s: "} \\times \\sigma_B", a: "SR_B", d: ["SR_p", "IR", "\\sigma_B"] },
      { p: "\\sigma_A^* = \\frac{", s: "}{SR_B} \\times \\sigma_B", a: "IR", d: ["SR_p", "E(R_A)", "IC"] },
      { p: "\\sigma_A^* = \\frac{IR}{SR_B} \\times ", s: "", a: "\\sigma_B", d: ["\\sigma_p", "\\sigma_A", "BR"] }
    ]
  },
  {
    t: "Portfolio Mgt", c: "Optimal Weight of Active Portfolio", n: "Allocation optimale à la stratégie active = Risque actif optimal / Risque actif actuel.",
    v: [
      { p: "W_A = \\frac{", s: "}{\\sigma_{A,\\ actuel}}", a: "\\sigma_A^*", d: ["\\sigma_B", "IR", "SR_B"] },
      { p: "W_A = \\frac{\\sigma_A^*}{", s: "}", a: "\\sigma_{A,\\ actuel}", d: ["\\sigma_B", "IR", "SR_B"] },
      { p: "W_{Benchmark} = ", s: " - W_A", a: "1", d: ["0", "\\sigma_B", "\\sigma_A^*"] }
    ]
  },
  {
    t: "Portfolio Mgt", c: "Maximum Sharpe Ratio", n: "Ratio combiné optimal.",
    v: [
      { p: "SR_{max} = \\sqrt{", s: " + IR^2}", a: "SR_B^2", d: ["SR_A^2", "\\sigma_B^2", "TC^2"] },
      { p: "SR_{max} = \\sqrt{SR_B^2 + ", s: "}", a: "IR^2", d: ["SR_A^2", "\\sigma_A^2", "E(R_A)^2"] }
    ]
  },
  {
    t: "Portfolio Mgt", c: "Ex-Ante Alpha", n: "Prédiction de l'Alpha généré.",
    v: [
      { p: "\\alpha = IC \\times \\sqrt{BR} \\times ", s: " \\times TC", a: "\\sigma_A", d: ["\\sigma_B", "SR_B", "IR"] },
      { p: "\\alpha = ", s: " \\times \\sqrt{BR} \\times \\sigma_A \\times TC", a: "IC", d: ["IR", "SR", "TC"] },
      { p: "\\alpha = IC \\times \\sqrt{BR} \\times \\sigma_A \\times ", s: "", a: "TC", d: ["IR", "SR_B", "1"] }
    ]
  },
  {
    t: "Portfolio Mgt", c: "Grinold-Kroner ERP", n: "Equity Risk Premium estimé.",
    v: [
      { p: "ERP = ", s: " - R_f", a: "(DY + \\Delta P/E + i + g)", d: ["(DY + \\Delta P/E + i - g)", "(DY - \\Delta P/E + i + g)", "(DY + \\Delta P/E - i + g)"] },
      { p: "\\text{Expected Return} = ", s: " + \\Delta P/E + i + g", a: "DY", d: ["R_f", "ERP", "\\Delta S"] }
    ]
  },
  {
    t: "Portfolio Mgt", c: "Expected Return via APT", n: "Modèle multifactoriel. R_f = base. \\beta = sensibilité. \\lambda = prime du facteur.",
    v: [
      { p: "E(R) = R_f + ", s: "", a: "(\\beta_1 \\times \\lambda_1) + (\\beta_2 \\times \\lambda_2)", d: ["(\\beta_1 + \\lambda_1) \\times (\\beta_2 + \\lambda_2)", "\\beta_1 + \\beta_2 + \\lambda_1 + \\lambda_2", "\\lambda_1 + \\lambda_2"] },
      { p: "E(R) = ", s: " + (\\beta_1 \\times \\lambda_1) + (\\beta_2 \\times \\lambda_2)", a: "R_f", d: ["E(R_M)", "\\alpha", "0"] },
      { p: "E(R) = R_f + (", s: " \\times \\lambda_1) + (\\beta_2 \\times \\lambda_2)", a: "\\beta_1", d: ["\\lambda_1", "R_M", "\\alpha"] }
    ]
  },
  {
    t: "Portfolio Mgt", c: "Relative Strength", n: "Compare la performance d'une action par rapport à un indice de référence.",
    v: [
      { p: "\\text{Rel Strength} = \\frac{", s: "}{\\left( \\frac{I_1}{I_0} \\right)_{\\text{Index}}}", a: "\\left( \\frac{P_1}{P_0} \\right)_{\\text{Stock}}", d: ["\\left( \\frac{P_0}{P_1} \\right)_{\\text{Stock}}", "P_1 - P_0", "\\left( \\frac{I_1}{I_0} \\right)_{\\text{Stock}}"] },
      { p: "\\text{Rel Strength} = \\frac{\\left( \\frac{P_1}{P_0} \\right)_{\\text{Stock}}}{", s: "}", a: "\\left( \\frac{I_1}{I_0} \\right)_{\\text{Index}}", d: ["\\left( \\frac{I_0}{I_1} \\right)_{\\text{Index}}", "\\left( \\frac{P_1}{P_0} \\right)_{\\text{Index}}", "I_1 - I_0"] }
    ]
  },
  {
    t: "Portfolio Mgt", c: "Value at Risk (VaR) - Parametric", n: "Perte maximale pour un seuil de confiance donné.",
    v: [
      { p: "VaR = \\left[ E(R_p) - ", s: " \\right] \\times V_p", a: "(z \\times \\sigma_p)", d: ["(z \\times \\sigma_B)", "(\\sigma_p)", "(z \\times \\beta_p)"] },
      { p: "VaR = \\left[ ", s: " - (z \\times \\sigma_p) \\right] \\times V_p", a: "E(R_p)", d: ["R_f", "0", "E(R_M)"] }
    ]
  },
  {
    t: "Portfolio Mgt", c: "Brinson: Pure Sector Allocation", n: "Mesure l'effet de l'allocation (sur/sous-pondérer un secteur).",
    v: [
      { p: "R_{alloc} = \\sum (W_p - W_b) ", s: "", a: "(R_{b,i} - R_b)", d: ["R_{b,i}", "(R_{p,i} - R_{b,i})", "R_{p,i}"] },
      { p: "R_{alloc} = \\sum ", s: " (R_{b,i} - R_b)", a: "(W_p - W_b)", d: ["W_b", "W_p", "(W_p / W_b)"] }
    ]
  },
  {
    t: "Portfolio Mgt", c: "Brinson: Selection", n: "Mesure l'effet du choix des titres au sein d'un secteur.",
    v: [
      { p: "R_{select} = \\sum W_b ", s: "", a: "(R_{p,i} - R_{b,i})", d: ["(W_p - W_b)", "R_{p,i}", "(R_{b,i} - R_b)"] }
    ]
  }
];

const AVAILABLE_TOPICS = [...new Set(RAW_DATABASE.map(item => item.t))];

// Initialisation avec tes 8 points noirs (Mise à jour du nom de Brinson)
const INITIAL_WEAKNESSES = [
  "Discount for Lack of Control (DLOC)",
  "Value of a Forward (via New Forward)",
  "Dickey-Fuller Test (Unit Root)",
  "Expected Loss & LGD",
  "Multi-Stage Terminal Value",
  "Cumulative Translation Adjustment (CTA)",
  "Common Equity Tier 1 (CET1) Ratio",
  "Brinson: Pure Sector Allocation"
];

// Preset Topics based on general Mock Exam Structure
const MOCK_SESSION_1_TOPICS = ["Quant & Econ", "FSA", "Fixed Income", "Alts"];
const MOCK_SESSION_2_TOPICS = ["Corp Issuers", "Equity", "Derivatives", "Portfolio Mgt"];

// Utility function to expand the raw database into individual questions
const expandDatabase = (rawDb) => {
  let expanded = [];
  rawDb.forEach(item => {
    item.v.forEach(variation => {
      expanded.push({
        topic: item.t,
        concept: item.c,
        notes: item.n,
        formulaPrefix: variation.p,
        formulaSuffix: variation.s,
        correctAnswer: variation.a,
        options: [variation.a, ...variation.d]
      });
    });
  });
  return expanded;
};

// Generate massive pool of questions
const FULL_DATABASE = expandDatabase(RAW_DATABASE);

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// --- SYSTÈME DE MAÎTRISE (Mastery / Leitner pondéré) ---
// Chaque concept a un niveau 0 (faible) à 7 (totalement maîtrisé).
// Niveau bas => apparaît plus souvent. Niveau haut => apparaît rarement mais JAMAIS supprimé.
const MAX_LEVEL = 7;

// Poids par niveau : un concept de niveau 0 est ~10x plus probable qu'un niveau 7.
const MASTERY_WEIGHTS = [10, 7, 5, 3.5, 2.5, 1.8, 1.3, 1];

const weightFromLevel = (level) => {
  const l = Math.max(0, Math.min(MAX_LEVEL, level ?? 4));
  return MASTERY_WEIGHTS[l];
};

// Catégorisation : <3 = faible, 3-4 = en cours, 5+ = maîtrisé
const categorizeLevel = (level) => {
  if (level == null) return 'unseen';
  if (level < 3) return 'weak';
  if (level < 5) return 'learning';
  return 'mastered';
};

// Shuffle pondéré (Efraimidis-Spirakis) : items à fort poids tendent à apparaître plus tôt,
// mais avec un entrelacement probabiliste — donc les concepts maîtrisés apparaissent toujours.
const weightedShuffle = (items, getWeight) => {
  return items
    .map(item => ({
      item,
      key: -Math.log(Math.random() || 1e-9) / Math.max(0.01, getWeight(item))
    }))
    .sort((a, b) => a.key - b.key)
    .map(x => x.item);
};

// Migration : ancien format (liste de noms) → nouveau format (mastery object).
const buildInitialMastery = () => {
  // 1. Essai de récupération du nouveau format
  try {
    const saved = localStorage.getItem('formula_mastery_v1');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  // 2. Migration depuis l'ancien format (liste de faiblesses)
  try {
    const oldSaved = localStorage.getItem('formula_weaknesses_v3');
    if (oldSaved) {
      const oldList = JSON.parse(oldSaved);
      const m = {};
      oldList.forEach(c => {
        m[c] = { level: 0, correct: 0, incorrect: 0, lastSeen: 0, consecutive: 0 };
      });
      return m;
    }
  } catch (e) {}
  // 3. Pas de save → seed avec les 8 points noirs initiaux
  const m = {};
  INITIAL_WEAKNESSES.forEach(c => {
    m[c] = { level: 0, correct: 0, incorrect: 0, lastSeen: 0, consecutive: 0 };
  });
  return m;
};

// KATEX COMPONENT
const LatexRenderer = ({ math, inline = false }) => {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (window.katex) {
      setIsLoaded(true);
      return;
    }
    const link = document.createElement('link');
    link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (isLoaded && containerRef.current && window.katex) {
      try {
        window.katex.render(math, containerRef.current, {
          throwOnError: false,
          displayMode: !inline,
        });
      } catch (e) {
        console.error("KaTeX Error:", e);
        containerRef.current.innerText = math;
      }
    }
  }, [math, isLoaded, inline]);

  if (!isLoaded) return <span className="animate-pulse text-slate-400">...</span>;
  return <span ref={containerRef} className="w-full flex justify-center items-center text-xl md:text-2xl overflow-x-auto overflow-y-visible py-6" />;
};

export default function App() {
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'result', 'library'
  const [selectedTopics, setSelectedTopics] = useState(AVAILABLE_TOPICS);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [mistakes, setMistakes] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // SYSTÈME DE MAÎTRISE : niveau par concept (0=faible, 7=maîtrisé)
  // Remplace l'ancienne liste binaire de faiblesses par un score graduel
  const [mastery, setMastery] = useState(buildInitialMastery);
  const [isWeaknessMode, setIsWeaknessMode] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('formula_mastery_v1', JSON.stringify(mastery));
    } catch (e) {
      console.error("Could not save mastery", e);
    }
  }, [mastery]);

  // Liste des concepts considérés "faibles" (non maîtrisés) - calculée depuis mastery
  // Un concept inconnu de l'objet mastery est considéré "neuf" (donc à pratiquer)
  const weakConcepts = (() => {
    const allConcepts = [...new Set(RAW_DATABASE.map(d => d.c))];
    return allConcepts.filter(c => {
      const m = mastery[c];
      return !m || m.level < 3;
    });
  })();

  // Stats globales pour l'affichage
  const masteryStats = (() => {
    const allConcepts = [...new Set(RAW_DATABASE.map(d => d.c))];
    const stats = { weak: 0, learning: 0, mastered: 0, unseen: 0 };
    allConcepts.forEach(c => {
      const cat = categorizeLevel(mastery[c]?.level);
      stats[cat]++;
    });
    return stats;
  })();

  // Met à jour la maîtrise d'un concept après une réponse
  const updateMastery = (concept, isCorrect) => {
    setMastery(prev => {
      const current = prev[concept] || { level: 4, correct: 0, incorrect: 0, lastSeen: 0, consecutive: 0 };
      const next = { ...current, lastSeen: Date.now() };
      if (isCorrect) {
        next.correct += 1;
        next.consecutive += 1;
        next.level = Math.min(MAX_LEVEL, current.level + 1);
      } else {
        next.incorrect += 1;
        next.consecutive = 0;
        // On retombe de 2 paliers en cas d'erreur pour bien renforcer
        next.level = Math.max(0, current.level - 2);
      }
      return { ...prev, [concept]: next };
    });
  };

  const activeVariationsCount = FULL_DATABASE.filter(q => selectedTopics.includes(q.topic)).length;

  const applyPreset = (preset) => {
    if (preset === 'all') setSelectedTopics(AVAILABLE_TOPICS);
    else if (preset === 'none') setSelectedTopics([]);
    else if (preset === 'session1') setSelectedTopics(MOCK_SESSION_1_TOPICS);
    else if (preset === 'session2') setSelectedTopics(MOCK_SESSION_2_TOPICS);
  };

  const startGame = (mode = 'normal') => {
    let filteredDB = [];

    if (mode === 'weaknesses') {
      // Mode Sprint Sur-Mesure : uniquement les concepts faibles (level < 3 ou jamais vus)
      filteredDB = FULL_DATABASE.filter(q => weakConcepts.includes(q.concept));
      setIsWeaknessMode(true);
    } else {
      if (selectedTopics.length === 0) return;
      filteredDB = FULL_DATABASE.filter(q => selectedTopics.includes(q.topic));
      setIsWeaknessMode(false);
    }

    if (filteredDB.length === 0) return;

    // Mode normal : shuffle PONDÉRÉ par maîtrise.
    // → Les concepts faibles (level bas) sont surreprésentés en début de session.
    // → Les concepts maîtrisés apparaissent quand même (poids non-nul) mais plus rarement.
    // Mode "weaknesses" : tout est faible par définition donc shuffle uniforme suffit.
    const orderedDB = mode === 'weaknesses'
      ? shuffleArray(filteredDB)
      : weightedShuffle(filteredDB, q => weightFromLevel(mastery[q.concept]?.level));

    const shuffledQuestions = orderedDB.map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));

    setQuestions(shuffledQuestions);
    setCurrentIndex(0);
    setQuestionsAnswered(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setMistakes([]);
    setGameState('playing');
    setSelectedAnswer(null);
  };

  const handleAnswer = (option) => {
    if (isAnimating) return;
    setSelectedAnswer(option);
    setIsAnimating(true);

    const currentQ = questions[currentIndex];
    const isCorrect = option === currentQ.correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(max => Math.max(max, newStreak));
        return newStreak;
      });
    } else {
      setStreak(0);
      setMistakes(prev => [...prev, { ...currentQ, userRef: option }]);
    }

    // Mise à jour du score de maîtrise pour le concept (graduel, pas binaire)
    updateMastery(currentQ.concept, isCorrect);

    setQuestionsAnswered(prev => prev + 1);

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnimating(false);
      } else {
        setGameState('result');
        setIsAnimating(false);
      }
    }, 1200);
  };

  const endGameEarly = () => {
    if (!isAnimating) {
      setGameState('result');
    }
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col items-center justify-center p-4 md:p-6">
        <div className="max-w-2xl w-full space-y-6 bg-slate-900 p-6 md:p-10 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-rose-600/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Finance Formula Trainer <br/><span className="text-rose-500">The Ultimate Marathon</span></h1>
            <p className="text-base md:text-lg text-slate-400 mt-3">
              Configure your Sprint according to the official Mock structures, or target your specific weak points manually.
            </p>
            <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto">
              Free & open-source · MIT/CC BY · Not exhaustive, not officially vetted — use as a study complement, not a substitute.
            </p>
          </div>

          {/* MODULE POINTS FAIBLES — désormais piloté par les scores de maîtrise */}
          <div className="bg-gradient-to-r from-amber-900/40 to-slate-900 p-5 rounded-2xl border border-amber-500/50 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-amber-500">🎯</span> Sprint Sur-Mesure : Tes Points Faibles
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  {weakConcepts.length} concept(s) à renforcer. Le mode normal teste tout, mais sur-pondère les faibles.
                </p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                 <button
                  onClick={() => startGame('weaknesses')}
                  disabled={weakConcepts.length === 0}
                  className={`px-6 py-3 font-bold rounded-xl transition-all w-full md:w-auto whitespace-nowrap ${
                    weakConcepts.length > 0
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_15px_rgba(217,119,6,0.4)] transform hover:scale-105'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Lancer le Sprint
                </button>
                {Object.keys(mastery).length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm("Réinitialiser TOUTE ta progression de maîtrise ?")) {
                        setMastery({});
                      }
                    }}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl text-sm"
                    title="Réinitialiser toute la progression"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Barre de progression de maîtrise */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-amber-500/20">
              <div className="bg-slate-950/60 rounded-lg p-2 text-center">
                <div className="text-rose-400 text-lg font-black">{masteryStats.weak + masteryStats.unseen}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">À renforcer</div>
              </div>
              <div className="bg-slate-950/60 rounded-lg p-2 text-center">
                <div className="text-amber-400 text-lg font-black">{masteryStats.learning}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">En cours</div>
              </div>
              <div className="bg-slate-950/60 rounded-lg p-2 text-center">
                <div className="text-emerald-400 text-lg font-black">{masteryStats.mastered}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">Maîtrisé</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/50 space-y-5">

            {/* Presets Row */}
            <div className="space-y-3">
              <p className="text-sm text-slate-400 uppercase font-semibold tracking-wider">Mock Exam Simulator</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => applyPreset('session1')}
                  className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-semibold py-2 px-3 rounded-lg text-sm transition-colors"
                >
                  Session 1 (Morning)
                </button>
                <button
                  onClick={() => applyPreset('session2')}
                  className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 font-semibold py-2 px-3 rounded-lg text-sm transition-colors"
                >
                  Session 2 (Afternoon)
                </button>
              </div>
              <div className="flex justify-between items-center pt-2">
                 <button onClick={() => applyPreset('all')} className="text-xs text-slate-500 hover:text-white transition-colors underline">Select All</button>
                 <button onClick={() => applyPreset('none')} className="text-xs text-slate-500 hover:text-white transition-colors underline">Deselect All</button>
              </div>
            </div>

            {/* Manual Toggle Grid */}
            <div className="pt-4 border-t border-slate-800">
              <p className="text-sm text-slate-400 uppercase font-semibold tracking-wider mb-3">Manual Selection</p>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TOPICS.map(topic => {
                  const isSelected = selectedTopics.includes(topic);
                  return (
                    <button
                      key={topic}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedTopics(prev => prev.filter(t => t !== topic));
                        } else {
                          setSelectedTopics(prev => [...prev, topic]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all border ${
                        isSelected
                          ? 'bg-rose-600/20 text-rose-400 border-rose-500/50'
                          : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700 hover:text-slate-400'
                      }`}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-sm bg-slate-900 p-3 rounded-lg border border-slate-800">
               <span className="text-slate-400">Variations in Sprint:</span>
               <span className={`font-bold text-lg ${activeVariationsCount > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                 {activeVariationsCount} <span className="text-xs font-normal text-slate-500">/ {FULL_DATABASE.length}</span>
               </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => startGame('normal')}
              disabled={selectedTopics.length === 0}
              className={`w-full font-bold py-4 px-8 rounded-xl transition-all duration-200 transform ${
                selectedTopics.length > 0
                  ? 'bg-rose-600 hover:bg-rose-500 text-white hover:scale-[1.02] shadow-[0_0_20px_rgba(225,29,72,0.3)]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {selectedTopics.length > 0 ? "Start the Sprint" : "Select at least one topic"}
            </button>
            <button
              onClick={() => setGameState('library')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 px-8 rounded-xl transition-all duration-200 border border-slate-700"
            >
              📚 View Master List ({RAW_DATABASE.length} Concepts)
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'library') {
    const groupedDB = RAW_DATABASE.reduce((acc, curr) => {
      if (!acc[curr.t]) acc[curr.t] = [];
      acc[curr.t].push(curr);
      return acc;
    }, {});

    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 p-6 pb-20 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8 mt-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Master List (Cheat Sheet)</h2>
            <button
              onClick={() => setGameState('start')}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors border border-slate-700"
            >
              Back
            </button>
          </div>

          <p className="text-slate-400 mb-8">
            Here are the {RAW_DATABASE.length} formulas currently integrated in the engine. The system will dynamically generate {FULL_DATABASE.length} practice variations from these core expressions.
          </p>

          <div className="space-y-12">
            {Object.entries(groupedDB).map(([topic, concepts]) => (
              <div key={topic} className="space-y-4">
                <h3 className="text-2xl font-bold text-rose-500 border-b border-slate-800 pb-2">{topic} ({concepts.length})</h3>
                <div className="grid gap-4">
                  {concepts.map((c, idx) => {
                    const m = mastery[c.c];
                    const cat = categorizeLevel(m?.level);
                    const badgeStyle = {
                      unseen:    { bg: 'bg-slate-800',       text: 'text-slate-400', label: 'Jamais vu' },
                      weak:      { bg: 'bg-rose-500/15',     text: 'text-rose-400',  label: `Faible · L${m?.level ?? 0}` },
                      learning:  { bg: 'bg-amber-500/15',    text: 'text-amber-400', label: `En cours · L${m?.level}` },
                      mastered:  { bg: 'bg-emerald-500/15',  text: 'text-emerald-400', label: `Maîtrisé · L${m?.level}` },
                    }[cat];
                    return (
                      <div key={idx} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1 min-w-[50%]">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h4 className="font-bold text-lg text-white">{c.c}</h4>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${badgeStyle.bg} ${badgeStyle.text}`}>
                              {badgeStyle.label}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400">{c.n}</p>
                          {m && (m.correct + m.incorrect) > 0 && (
                            <p className="text-xs text-slate-600 mt-1">
                              {m.correct}✓ / {m.incorrect}✗ — streak {m.consecutive}
                            </p>
                          )}
                        </div>
                        <div className="bg-slate-950 px-4 py-6 rounded-xl border border-slate-800 flex-1 text-center overflow-x-auto overflow-y-visible">
                          <LatexRenderer math={`${c.v[0].p}${c.v[0].a}${c.v[0].s}`} inline={true} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'result') {
    const total = questionsAnswered;
    const passRate = total > 0 ? (score / total) * 100 : 0;
    const isPass = passRate >= 70;

    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 p-6 pb-20 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-8 mt-10">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-white">Session Review</h2>
            <div className="flex justify-center items-center gap-6">
              <div className="bg-slate-900 px-6 py-4 rounded-2xl border border-slate-800">
                <p className="text-sm text-slate-500 uppercase">Score</p>
                <p className={`text-4xl font-black ${isPass && total > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {score} / {total}
                </p>
                <p className="text-xs text-slate-500 mt-1">out of {questions.length} variations targeted</p>
              </div>
              <div className="bg-slate-900 px-6 py-4 rounded-2xl border border-slate-800">
                <p className="text-sm text-slate-500 uppercase">Max Streak</p>
                <p className="text-4xl font-black text-amber-500">{maxStreak} 🔥</p>
              </div>
            </div>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              {total === 0
                ? "You stopped before even answering!"
                : isPass
                ? "Excellent ratio. Your grasp of these underlying mathematical mechanisms is solid."
                : "The variations have revealed your blind spots. Review your mistakes below."}
            </p>
          </div>

          {mistakes.length > 0 && (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
              <div className="bg-slate-800/50 p-6 border-b border-slate-800">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-rose-500">⚠</span> {mistakes.length} Concepts to Review
                </h3>
              </div>
              <div className="divide-y divide-slate-800/50">
                {mistakes.map((m, idx) => (
                  <div key={idx} className="p-6 space-y-4 hover:bg-slate-800/20 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold px-2 py-1 bg-slate-800 text-slate-400 rounded-md uppercase tracking-wide">
                          {m.topic}
                        </span>
                        <h4 className="text-lg font-bold text-white mt-2">{m.concept}</h4>
                      </div>
                    </div>

                    <div className="bg-slate-950 px-4 py-6 rounded-xl border border-slate-800/80 overflow-x-auto overflow-y-visible text-center">
                      <LatexRenderer math={`${m.formulaPrefix}${m.correctAnswer}${m.formulaSuffix}`} inline={false} />
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-rose-500 font-bold whitespace-nowrap">Your Answer:</span>
                        <span className="bg-rose-500/10 text-rose-400 px-3 py-1.5 rounded flex items-center justify-center overflow-x-auto max-w-[200px]"><LatexRenderer math={m.userRef} inline={true} /></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-500 font-bold whitespace-nowrap">Correct:</span>
                        <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded flex items-center justify-center overflow-x-auto max-w-[200px]"><LatexRenderer math={m.correctAnswer} inline={true} /></span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 italic">💡 {m.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => startGame(isWeaknessMode ? 'weaknesses' : 'normal')}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 border border-slate-700"
            >
              Restart This Sprint
            </button>
            <button
              onClick={() => setGameState('start')}
              className="bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold py-4 px-8 rounded-xl transition-all duration-200 border border-slate-800"
            >
              Change Topics
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progressPercent = ((currentIndex) / questions.length) * 100;

  // Formatting logic
  const formattedAnswer = !selectedAnswer
    ? '\\text{ [ ? ] }'
    : currentQ.correctAnswer === selectedAnswer
      ? `{${currentQ.correctAnswer}}`
      : `{${selectedAnswer}}`;

  const formattedColor = !selectedAnswer ? '#3b82f6' : selectedAnswer === currentQ.correctAnswer ? '#10b981' : '#f43f5e';

  // Natural KaTeX string rendering
  const renderMathString = `${currentQ.formulaPrefix}{\\color{${formattedColor}}{${formattedAnswer}}}${currentQ.formulaSuffix}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center p-4 md:p-8">
      {/* Header / HUD */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-slate-800 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-300">
            Q: {currentIndex + 1} <span className="text-slate-500">/ {questions.length}</span>
          </div>
          <div className="hidden md:block w-32 lg:w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <div className="flex gap-4 md:gap-6 items-center">
          <button
            onClick={endGameEarly}
            className="text-sm font-semibold text-slate-400 hover:text-rose-400 transition-colors px-3 py-1 rounded-md hover:bg-rose-500/10"
          >
            ⏹ Stop
          </button>
          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Score</span>
            <span className="text-lg font-bold text-white">{score}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Streak</span>
            <span className={`text-lg font-bold ${streak > 2 ? 'text-amber-500' : 'text-slate-300'}`}>
              {streak} {streak > 2 && '🔥'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="w-full max-w-4xl flex flex-col flex-grow">
        <div className="bg-slate-900 rounded-3xl p-6 md:p-10 border border-slate-800 shadow-2xl flex flex-col items-center text-center space-y-8 relative overflow-hidden">

          {/* Tag */}
          <span className="inline-block bg-rose-500/10 text-rose-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            {currentQ.topic}
          </span>

          {/* Concept Name */}
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            {currentQ.concept}
          </h2>

          {/* Context Notes */}
          <p className="text-slate-400 max-w-2xl text-lg">
            {currentQ.notes}
          </p>

          {/* THE FORMULA BUILDER */}
          <div className="w-full bg-slate-950 py-12 px-2 md:px-6 rounded-2xl border border-slate-800 shadow-inner flex justify-center items-center overflow-x-auto overflow-y-visible min-h-[160px] text-xl md:text-3xl select-none">
             <LatexRenderer
                inline={false}
                math={renderMathString}
             />
          </div>

        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {currentQ.options.map((option, idx) => {

            let btnStateClasses = "bg-slate-900 border-slate-800 hover:border-rose-500 hover:bg-slate-800 text-slate-200";

            if (selectedAnswer) {
              if (option === currentQ.correctAnswer) {
                btnStateClasses = "bg-emerald-500/20 border-emerald-500 text-emerald-400"; // Always show correct
              } else if (option === selectedAnswer) {
                btnStateClasses = "bg-rose-500/20 border-rose-500 text-rose-400"; // Show wrong if picked
              } else {
                btnStateClasses = "bg-slate-950 border-slate-900 text-slate-700 opacity-50"; // Dim others
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnimating}
                onClick={() => handleAnswer(option)}
                className={`flex items-center justify-center min-h-[80px] p-2 md:p-4 text-base md:text-lg rounded-2xl border-2 transition-all duration-200 transform overflow-hidden ${!isAnimating && 'hover:-translate-y-1 active:scale-95'} ${btnStateClasses}`}
              >
                <div className="w-full overflow-x-auto overflow-y-visible pointer-events-none flex justify-center py-2">
                  <LatexRenderer math={option} inline={true} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
