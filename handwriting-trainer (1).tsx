/*
 * ============================================================================
 * Finance Formula Trainer — Handwriting Recall Mode
 * ============================================================================
 *
 * A free, open-source flashcard trainer for finance formulas.
 * Active recall via stylus input + spaced-repetition-lite mastery tracking.
 *
 * This is a personal tool shared with the community. It is not exhaustive,
 * not officially vetted, and not affiliated with any institution or program.
 * Use it as a complement to real study material, not a replacement.
 *
 * ----------------------------------------------------------------------------
 * CODE LICENSE — MIT
 * ----------------------------------------------------------------------------
 * Copyright (c) 2026 [Your Name Here]
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
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 * ----------------------------------------------------------------------------
 * CONTENT LICENSE — CC BY 4.0
 * ----------------------------------------------------------------------------
 * The formulas, notes, curation, and pedagogical structure (the "Content")
 * are licensed under Creative Commons Attribution 4.0 International.
 * https://creativecommons.org/licenses/by/4.0/
 *
 * You are free to share and adapt the Content, provided you give appropriate
 * credit and indicate if changes were made.
 *
 * ----------------------------------------------------------------------------
 * ATTRIBUTION
 * ----------------------------------------------------------------------------
 * Built with Claude. Content curation, formula selection and notes are mine.
 *
 * ============================================================================
 */

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

// --- FORMULA DATABASE ---
const RAW_DATABASE = [
  // --- 1. QUANTITATIVE METHODS & ECONOMICS ---
  { t: "Quant & Econ", c: "Adjusted R²", n: "Pénalise l'ajout de variables non pertinentes.", v: [{ p: "R^2_{adj} = 1 - \\left[ \\left( \\frac{n-1}{n-k-1} \\right) \\times ", s: " \\right]", a: "(1 - R^2)" }, { p: "R^2_{adj} = 1 - \\left[ ", s: " \\times (1 - R^2) \\right]", a: "\\left( \\frac{n-1}{n-k-1} \\right)" }, { p: "", s: " = 1 - \\left[ \\left( \\frac{n-1}{n-k-1} \\right) \\times (1 - R^2) \\right]", a: "R^2_{adj}" }, { p: "R^2_{adj} = 1 - \\left[ \\left( \\frac{n-1}{", s: "} \\right) \\times (1 - R^2) \\right]", a: "n-k-1" }]},
  { t: "Quant & Econ", c: "Akaike Information Criterion (AIC)", n: "Sélection de modèle. Utile pour la PREDICTIVE PRECISION. Règle : 'The lower, the better'.", v: [{ p: "\\text{AIC primarily evaluates: }", s: "", a: "\\text{Predictive Precision}" }, { p: "\\text{Rule for evaluating AIC: }", s: "", a: "\\text{Lower is better}" }]},
  { t: "Quant & Econ", c: "Bayesian Information Criterion (BIC)", n: "Sélection de modèle. Utile pour le GOODNESS OF FIT. Pénalise fortement l'ajout de variables.", v: [{ p: "\\text{Compared to AIC, BIC penalty is: }", s: "", a: "\\text{More strict}" }, { p: "\\text{BIC primarily evaluates: }", s: "", a: "\\text{Goodness of Fit}" }]},
  { t: "Quant & Econ", c: "F-Statistic", n: "Significativité globale. H0: Tous les coefficients de pente = 0 simultanément. Rejet si F > F_critical.", v: [{ p: "F = \\frac{MSR}{", s: "} = \\frac{RSS/k}{SSE/(n-k-1)}", a: "MSE" }, { p: "H_0 \\text{ for overall F-test: slopes } = ", s: "", a: "0" }, { p: "\\text{To prove overall model validity: }", s: "", a: "\\text{Reject } H_0" }]},
  { t: "Quant & Econ", c: "t-Statistic", n: "Significativité individuelle. H0: b1 = 0. Rejet si |t| > t_critical.", v: [{ p: "t = \\frac{\\hat{b}_1 - b_1}{", s: "}", a: "S_{\\hat{b}_1}" }, { p: "\\text{If } |t| > t_{critical}\\text{, you must: }", s: "", a: "\\text{Reject } H_0" }]},
  { t: "Quant & Econ", c: "Breusch-Pagan Test", n: "Teste l'hétéroscédasticité. H0: Homoscédasticité. Piège : Ne PAS rejeter H0 !", v: [{ p: "BP = n \\times ", s: "", a: "R^2_{residuals}" }, { p: "H_0 \\text{ for Breusch-Pagan: }", s: "", a: "\\text{Homoskedasticity}" }, { p: "\\text{If BP rejects } H_0\\text{, standard errors are: }", s: "", a: "\\text{Unreliable}" }]},
  { t: "Quant & Econ", c: "Breusch-Godfrey Test", n: "Teste l'autocorrélation sérielle. H0: Absence d'autocorrélation. Piège : Ne PAS rejeter H0 !", v: [{ p: "H_0 \\text{ for Breusch-Godfrey: }", s: "", a: "\\text{No serial correlation}" }, { p: "\\text{The Breusch-Godfrey test primarily detects: }", s: "", a: "\\text{Serial correlation}" }, { p: "\\text{If BG test rejects } H_0\\text{, the model suffers from: }", s: "", a: "\\text{Serial correlation}" }]},
  { t: "Quant & Econ", c: "Variance Inflation Factor (VIF)", n: "Détecte la multicolinéarité. Seuil : VIF > 5 (attention), > 10 (sévère).", v: [{ p: "VIF = \\frac{1}{", s: "}", a: "1 - R^2_j" }, { p: "\\text{VIF is primarily used to detect: }", s: "", a: "\\text{Multicollinearity}" }, { p: "\\text{VIF } > 10 \\implies ", s: "", a: "\\text{Severe Multicollinearity}" }, { p: "\\text{Fix for severe Multicollinearity: }", s: "", a: "\\text{Drop correlated variable}" }]},
  { t: "Quant & Econ", c: "Mean Reverting Level", n: "Niveau vers lequel la série AR tend à long terme.", v: [{ p: "x_t = \\frac{b_0}{", s: "}", a: "1 - b_1" }, { p: "x_t = \\frac{", s: "}{1 - b_1}", a: "b_0" }, { p: "", s: " = \\frac{b_0}{1 - b_1}", a: "x_t" }]},
  { t: "Quant & Econ", c: "Precision", n: "Qualité des prédictions positives.", v: [{ p: "Precision = \\frac{TP}{", s: "}", a: "TP + FP" }, { p: "Precision = \\frac{", s: "}{TP + FP}", a: "TP" }]},
  { t: "Quant & Econ", c: "Recall", n: "Capacité à trouver tous les vrais positifs (Sensibilité).", v: [{ p: "Recall = \\frac{TP}{", s: "}", a: "TP + FN" }, { p: "Recall = \\frac{", s: "}{TP + FN}", a: "TP" }]},
  { t: "Quant & Econ", c: "Accuracy", n: "Proportion totale de prédictions correctes.", v: [{ p: "Accuracy = \\frac{TP + TN}{", s: "}", a: "TP + FP + FN + TN" }, { p: "Accuracy = \\frac{", s: "}{Total}", a: "TP + TN" }]},
  { t: "Quant & Econ", c: "F1 Score", n: "Moyenne harmonique de la précision et du recall.", v: [{ p: "F1 = \\frac{", s: "}{Precision + Recall}", a: "2 \\times Precision \\times Recall" }, { p: "F1 = \\frac{2 \\times Precision \\times Recall}{", s: "}", a: "Precision + Recall" }]},
  { t: "Quant & Econ", c: "Covered Interest Rate Parity", n: "Sans opportunité d'arbitrage. Utilise les taux sans risque.", v: [{ p: "F_{f/d} = S_{f/d} \\times \\frac{", s: "}{1 + i_d \\times (act/360)}", a: "1 + i_f \\times (act/360)" }, { p: "F_{f/d} = S_{f/d} \\times \\frac{1 + i_f \\times (act/360)}{", s: "}", a: "1 + i_d \\times (act/360)" }, { p: "F_{f/d} = ", s: " \\times \\frac{1 + i_f(act/360)}{1 + i_d(act/360)}", a: "S_{f/d}" }]},
  { t: "Quant & Econ", c: "Uncovered Interest Rate Parity", n: "La monnaie à haut taux d'intérêt doit se déprécier.", v: [{ p: "\\% \\Delta S_{f/d} = ", s: "", a: "i_f - i_d" }]},
  { t: "Quant & Econ", c: "Real Exchange Rate", n: "Ajuste le pouvoir d'achat.", v: [{ p: "Real\\ FX_{d/f} = \\text{Nominal FX}_{d/f} \\times ", s: "", a: "\\left( \\frac{CPI_f}{CPI_d} \\right)" }, { p: "Real\\ FX_{d/f} = ", s: " \\times \\left( \\frac{CPI_f}{CPI_d} \\right)", a: "\\text{Nominal FX}_{d/f}" }]},
  { t: "Quant & Econ", c: "Taylor Rule", n: "Taux cible de la banque centrale.", v: [{ p: "R_{target} = R_{neutral} + \\pi_{exp} + ", s: " + 0.5(Y_{exp} - Y_{trend})", a: "0.5(\\pi_{exp} - \\pi_{target})" }, { p: "R_{target} = R_{neutral} + \\pi_{exp} + 0.5(\\pi_{exp} - \\pi_{target}) + ", s: "", a: "0.5(Y_{exp} - Y_{trend})" }, { p: "R_{target} = ", s: " + \\pi_{exp} + 0.5(\\pi_{exp} - \\pi_{target}) + 0.5(Y_{exp} - Y_{trend})", a: "R_{neutral}" }]},
  { t: "Quant & Econ", c: "Cobb-Douglas Production", n: "Modèle de production. T = TFP.", v: [{ p: "Y = T \\times K^{\\alpha} \\times ", s: "", a: "L^{(1-\\alpha)}" }, { p: "Y = T \\times ", s: " \\times L^{(1-\\alpha)}", a: "K^{\\alpha}" }, { p: "Y = ", s: " \\times K^{\\alpha} L^{(1-\\alpha)}", a: "T" }]},
  { t: "Quant & Econ", c: "Neoclassical Steady State Growth", n: "Croissance du PIB TOTAL.", v: [{ p: "Growth = ", s: " + n", a: "\\frac{\\theta}{1-\\alpha}" }, { p: "Growth = \\frac{\\theta}{1-\\alpha} ", s: "", a: "+ n" }]},
  { t: "Quant & Econ", c: "Labor Productivity Growth", n: "Croissance de la productivité du travail.", v: [{ p: "\\Delta \\text{Labor Prod} = ", s: " + \\Delta \\text{Cap Deepening}", a: "\\Delta \\text{TFP}" }, { p: "\\Delta \\text{Labor Prod} = \\Delta \\text{TFP} + ", s: "", a: "\\Delta \\text{Cap Deepening}" }]},
  { t: "Quant & Econ", c: "Potential GDP Growth", n: "Croissance potentielle du PIB.", v: [{ p: "\\text{Potential GDP Growth} = \\text{Growth in Total Hours Worked} + ", s: "", a: "\\text{Growth in Labor Productivity}" }, { p: "\\text{Potential GDP Growth} = ", s: " + \\text{Growth in Labor Productivity}", a: "\\text{Growth in Total Hours Worked}" }]},
  { t: "Quant & Econ", c: "Dickey-Fuller Test (Unit Root)", n: "Test de racine unitaire. H0: g=0 (série non stationnaire). On VEUT rejeter H0.", v: [{ p: "x_t - x_{t-1} = b_0 + ", s: " \\times x_{t-1} + \\epsilon_t", a: "g" }, { p: "H_0 \\text{ for Dickey-Fuller: }", s: "", a: "\\text{Unit Root (Non-stationary)}" }, { p: "\\text{To prove stationarity (DF test): }", s: "", a: "\\text{Reject } H_0" }]},

  // --- 2. FSA ---
  { t: "FSA", c: "Current Rate Method Exposure", n: "Utilisé quand la monnaie locale est la devise fonctionnelle.", v: [{ p: "\\text{Net Exposure} = \\text{Total Assets} - \\text{Total Liab} = ", s: "", a: "\\text{Total Equity}" }, { p: "\\text{Net Exposure} = ", s: " - \\text{Total Liab}", a: "\\text{Total Assets}" }]},
  { t: "FSA", c: "Temporal Method Exposure", n: "Utilisé quand la monnaie de la société mère est la devise fonctionnelle.", v: [{ p: "\\text{Net Exposure} = ", s: " - \\text{Monetary Liab}", a: "\\text{Monetary Assets}" }, { p: "\\text{Net Exposure} = \\text{Monetary Assets} - ", s: "", a: "\\text{Monetary Liab}" }]},
  { t: "FSA", c: "Altman Z-Score (Seuils)", n: "Seuil critique de risque de faillite.", v: [{ p: "\\text{Risque de faillite élevé si : } Z ", s: "", a: "< 1.81" }, { p: "\\text{Zone de sécurité si : } Z ", s: "", a: "> 2.99" }]},
  { t: "FSA", c: "Beneish M-Score (Seuils)", n: "Probabilité de manipulation des résultats.", v: [{ p: "\\text{Manipulation probable si : } M ", s: "", a: "> -1.78" }, { p: "\\text{Pas de manipulation probable si : } M ", s: "", a: "< -1.78" }]},
  { t: "FSA", c: "Funded Status", n: "Statut de financement de la pension.", v: [{ p: "\\text{Funded Status} = \\text{Fair Value of Plan Assets} - ", s: "", a: "\\text{PBO}" }, { p: "\\text{Funded Status} = ", s: " - \\text{PBO}", a: "\\text{Fair Value of Plan Assets}" }]},
  { t: "FSA", c: "Periodic Pension Cost (P&L - IFRS)", n: "Composante P&L en IFRS.", v: [{ p: "\\text{Cost} = \\text{Current Service} + ", s: " + \\text{Past Service}", a: "\\text{Net Interest}" }, { p: "\\text{Cost} = ", s: " + \\text{Net Interest} + \\text{Past Service}", a: "\\text{Current Service}" }]},
  { t: "FSA", c: "Periodic Pension Cost (P&L - US GAAP)", n: "Charge de retraite au P&L sous US GAAP.", v: [{ p: "\\text{Cost} = \\text{Current Serv} + ", s: " - \\text{Exp. Return} \\pm \\text{Amort}", a: "\\text{Interest Cost}" }, { p: "\\text{Cost} = \\text{Current Serv} + \\text{Interest Cost} - ", s: " \\pm \\text{Amort}", a: "\\text{Exp. Return}" }]},
  { t: "FSA", c: "Total Periodic Pension Cost (TPPC)", n: "Coût économique global des pensions.", v: [{ p: "TPPC = \\text{Employer Contributions} - ", s: "", a: "\\Delta \\text{Funded Status}" }, { p: "TPPC = ", s: " - \\Delta \\text{Funded Status}", a: "\\text{Employer Contributions}" }]},
  { t: "FSA", c: "Cash-Flow Based Accruals Ratio", n: "Qualité des résultats (plus bas = meilleur).", v: [{ p: "\\text{Ratio} = \\frac{", s: "}{\\text{Average NOA}}", a: "NI - (CFO + CFI)" }, { p: "\\text{Ratio} = \\frac{NI - (CFO + CFI)}{", s: "}", a: "\\text{Average NOA}" }]},
  { t: "FSA", c: "Balance Sheet Based Accruals Ratio", n: "Accumulation des actifs nets.", v: [{ p: "\\text{Ratio} = \\frac{", s: "}{\\text{Average NOA}}", a: "\\Delta NOA" }, { p: "\\text{Ratio} = \\frac{\\Delta NOA}{", s: "}", a: "\\text{Average NOA}" }]},
  { t: "FSA", c: "DuPont Analysis (3-Part)", n: "Décomposition du ROE en 3 ratios.", v: [{ p: "ROE = \\frac{NI}{Rev} \\times \\frac{Rev}{\\text{Avg Assets}} \\times ", s: "", a: "\\frac{\\text{Avg Assets}}{\\text{Avg Equity}}" }, { p: "ROE = \\frac{NI}{Rev} \\times ", s: " \\times \\frac{\\text{Avg Assets}}{\\text{Avg Equity}}", a: "\\frac{Rev}{\\text{Avg Assets}}" }, { p: "ROE = ", s: " \\times \\text{Asset Turnover} \\times \\text{Leverage}", a: "\\text{Net Margin}" }]},
  { t: "FSA", c: "DuPont Analysis (5-Part)", n: "Décomposition ultime du ROE.", v: [{ p: "ROE = \\frac{NI}{EBT} \\times ", s: " \\times \\frac{EBIT}{Rev} \\times \\text{Turnover} \\times \\text{Leverage}", a: "\\frac{EBT}{EBIT}" }, { p: "ROE = ", s: " \\times \\frac{EBT}{EBIT} \\times \\frac{EBIT}{Rev} \\dots", a: "\\frac{NI}{EBT}" }]},
  { t: "FSA", c: "Cash Conversion Cycle (CCC)", n: "Besoin net en fonds de roulement en jours.", v: [{ p: "CCC = ", s: " + DSO - DPO", a: "DOH" }, { p: "CCC = DOH + ", s: " - DPO", a: "DSO" }, { p: "CCC = DOH + DSO - ", s: "", a: "DPO" }]},
  { t: "FSA", c: "Common Equity Tier 1 (CET1) Ratio", n: "Solvabilité d'une banque. CET1 Capital = Common Equity - Intangibles - DTA.", v: [{ p: "CET1\\ Ratio = \\frac{", s: "}{\\text{Total Risk-Weighted Assets}}", a: "\\text{Common Eq} - \\text{Intangibles} - \\text{DTA}" }, { p: "CET1\\ Ratio = \\frac{\\text{Common Eq} - \\text{Intangibles} - \\text{DTA}}{", s: "}", a: "\\text{Total Risk-Weighted Assets}" }, { p: "CET1\\ Capital = \\text{Common Equity} - \\text{Intangible Assets} - ", s: "", a: "\\text{Deferred Tax Assets}" }]},
  { t: "FSA", c: "Cumulative Translation Adjustment (CTA)", n: "Current Rate Method: CTA va en Equity (OCI). Temporal: Gain/Loss en Income Statement.", v: [{ p: "\\text{Current Rate Method: } \\Delta \\text{CTA} \\rightarrow ", s: "", a: "\\text{Equity (OCI)}" }, { p: "\\text{Temporal Method: Remeasurement Gain/Loss} \\rightarrow ", s: "", a: "\\text{Income Statement}" }]},
  { t: "FSA", c: "Liquidity Coverage Ratio (LCR)", n: "Stress de liquidité 30 jours (Bâle III). Doit être > 100%.", v: [{ p: "\\text{LCR} = \\frac{", s: "}{\\text{Net Cash Outflows}}", a: "\\text{High-Quality Liquid Assets}" }, { p: "\\text{LCR} = \\frac{\\text{High-Quality Liquid Assets}}{", s: "}", a: "\\text{Net Cash Outflows}" }]},

  // --- 3. CORPORATE ISSUERS ---
  { t: "Corp Issuers", c: "Weighted Average Cost of Capital (WACC)", n: "Coût global du financement.", v: [{ p: "WACC = \\left(\\frac{E}{V}\\right)r_e + ", s: " + \\left(\\frac{P}{V}\\right)r_p", a: "\\left(\\frac{D}{V}\\right)r_d(1-t)" }, { p: "WACC = ", s: " + \\left(\\frac{D}{V}\\right)r_d(1-t) + \\left(\\frac{P}{V}\\right)r_p", a: "\\left(\\frac{E}{V}\\right)r_e" }]},
  { t: "Corp Issuers", c: "Modigliani-Miller Prop II (w/ Taxes)", n: "Le coût des actions augmente avec le levier.", v: [{ p: "r_e = r_0 + ", s: "", a: "(r_0 - r_d)(1-t)\\frac{D}{E}" }, { p: "r_e = ", s: " + (r_0 - r_d)(1-t)\\frac{D}{E}", a: "r_0" }, { p: "r_e = r_0 + (r_0 - r_d)", s: "\\frac{D}{E}", a: "(1-t)" }]},
  { t: "Corp Issuers", c: "Expected Dividend (Target Payout)", n: "Modèle de lissage de Lintner.", v: [{ p: "Exp\\ Div = D_0 + [(EPS_1 \\times \\text{Target}) - D_0] \\times ", s: "", a: "\\text{Adj Factor}" }, { p: "Exp\\ Div = ", s: " + [(EPS_1 \\times \\text{Payout}) - D_0] \\times \\text{Adj}", a: "D_0" }]},
  { t: "Corp Issuers", c: "Unlevered Beta (Asset Beta)", n: "Retire l'effet du levier financier.", v: [{ p: "\\beta_U = \\frac{", s: "}{1 + (1-t)\\frac{D}{E}}", a: "\\beta_E" }, { p: "\\beta_U = \\frac{\\beta_E}{", s: "}", a: "1 + (1-t)\\frac{D}{E}" }]},
  { t: "Corp Issuers", c: "Relevered Beta (Project Beta)", n: "Ajoute le levier cible du projet.", v: [{ p: "\\beta_{Project} = ", s: " \\times \\left[ 1 + (1-t)\\frac{D}{E} \\right]", a: "\\beta_U" }, { p: "\\beta_{Project} = \\beta_U \\times \\left[ 1 + ", s: " \\right]", a: "(1-t)\\frac{D}{E}" }]},

  // --- 4. EQUITY ---
  { t: "Equity", c: "FCFF (from NI)", n: "Flux pour tous les apporteurs de capitaux.", v: [{ p: "FCFF = NI + NCC + ", s: " - FCInv - WCInv", a: "Int(1-t)" }, { p: "FCFF = ", s: " + NCC + Int(1-t) - FCInv - WCInv", a: "NI" }, { p: "FCFF = NI + NCC + Int(1-t) - ", s: " - WCInv", a: "FCInv" }]},
  { t: "Equity", c: "FCFF (from CFO)", n: "Formule la plus rapide via le CFO.", v: [{ p: "FCFF = CFO + ", s: " - FCInv", a: "Int(1-t)" }, { p: "FCFF = ", s: " + Int(1-t) - FCInv", a: "CFO" }]},
  { t: "Equity", c: "FCFF (from EBITDA)", n: "Utilise l'EBITDA et le tax shield de l'amortissement.", v: [{ p: "FCFF = ", s: " + Dep \\times t - FCInv - WCInv", a: "EBITDA(1 - t)" }, { p: "FCFF = EBITDA(1 - t) + ", s: " - FCInv - WCInv", a: "Dep \\times t" }]},
  { t: "Equity", c: "FCFE (from NI)", n: "Flux pour les actionnaires uniquement.", v: [{ p: "FCFE = NI + NCC - FCInv - WCInv + ", s: "", a: "Net\\ Borrowing" }, { p: "FCFE = ", s: " + NCC - FCInv - WCInv + Net\\ Borrowing", a: "NI" }]},
  { t: "Equity", c: "FCFE (from CFO)", n: "CFO au lieu de NI.", v: [{ p: "FCFE = CFO - FCInv + ", s: "", a: "Net\\ Borrowing" }, { p: "FCFE = ", s: " - FCInv + Net\\ Borrowing", a: "CFO" }]},
  { t: "Equity", c: "FCFE (from FCFF)", n: "Passage du flux ferme au flux actionnaires.", v: [{ p: "FCFE = FCFF - ", s: " + Net\\ Borrowing", a: "Int(1-t)" }, { p: "FCFE = ", s: " - Int(1-t) + Net\\ Borrowing", a: "FCFF" }]},
  { t: "Equity", c: "FCFE Coverage Ratio", n: "Capacité à couvrir les retours aux actionnaires.", v: [{ p: "\\text{Coverage Ratio} = \\frac{", s: "}{\\text{Dividends} + \\text{Repurchases}}", a: "FCFE" }, { p: "\\text{Coverage Ratio} = \\frac{FCFE}{", s: "}", a: "\\text{Dividends} + \\text{Repurchases}" }]},
  { t: "Equity", c: "Firm Value (Constant Growth)", n: "Modèle de Gordon pour FCFF.", v: [{ p: "\\text{Firm Value} = \\frac{FCFF_1}{", s: "}", a: "WACC - g" }, { p: "\\text{Firm Value} = \\frac{", s: "}{WACC - g}", a: "FCFF_1" }]},
  { t: "Equity", c: "Gordon Growth Model", n: "Valorisation des actions (Dividend Discount).", v: [{ p: "V_0 = \\frac{D_0(1+g)}{", s: "}", a: "r - g" }, { p: "V_0 = \\frac{", s: "}{r - g}", a: "D_0(1+g)" }]},
  { t: "Equity", c: "H-Model", n: "H = Demi-vie de la période de forte croissance.", v: [{ p: "V_0 = \\frac{D_0(1+g_L)}{r - g_L} + \\frac{", s: "}{r - g_L}", a: "D_0 \\times H \\times (g_S - g_L)" }]},
  { t: "Equity", c: "PVGO", n: "Valeur des opportunités de croissance.", v: [{ p: "PVGO = P_0 - ", s: "", a: "\\frac{E_1}{r}" }, { p: "PVGO = ", s: " - \\frac{E_1}{r}", a: "P_0" }, { p: "P_0 = \\frac{E_1}{r} + ", s: "", a: "PVGO" }]},
  { t: "Equity", c: "Justified Trailing P/E", n: "Basé sur les bénéfices passés (E0).", v: [{ p: "\\frac{P_0}{E_0} = \\frac{", s: "}{r - g}", a: "(1-b)(1+g)" }, { p: "\\frac{P_0}{E_0} = \\frac{(1-b)(1+g)}{", s: "}", a: "r - g" }]},
  { t: "Equity", c: "Justified Leading P/E", n: "Basé sur les bénéfices futurs (E1).", v: [{ p: "\\frac{P_0}{E_1} = \\frac{", s: "}{r - g}", a: "1-b" }, { p: "\\frac{P_0}{E_1} = \\frac{1-b}{", s: "}", a: "r - g" }]},
  { t: "Equity", c: "Justified P/B Ratio", n: "Justifie la valo comptable.", v: [{ p: "\\frac{P_0}{B_0} = \\frac{", s: "}{r - g}", a: "ROE - g" }, { p: "\\frac{P_0}{B_0} = \\frac{ROE - g}{", s: "}", a: "r - g" }]},
  { t: "Equity", c: "Justified P/S Ratio", n: "Relie la marge nette à la valorisation.", v: [{ p: "\\frac{P_0}{S_0} = \\frac{", s: "}{r - g}", a: "\\text{Net Margin} \\times \\text{Payout} \\times (1+g)" }]},
  { t: "Equity", c: "PEG Ratio", n: "Relie la valorisation à la croissance.", v: [{ p: "PEG = \\frac{P/E}{", s: "}", a: "g" }, { p: "PEG = \\frac{", s: "}{g}", a: "P/E" }]},
  { t: "Equity", c: "Sustainable Growth Rate (g)", n: "Croissance sans émission d'actions.", v: [{ p: "g = ", s: " \\times ROE", a: "(1 - \\text{Payout})" }, { p: "g = \\text{Retention Rate} \\times ", s: "", a: "ROE" }]},
  { t: "Equity", c: "Residual Income (RI_t)", n: "Profit économique.", v: [{ p: "RI_t = ", s: " \\times B_{t-1}", a: "(ROE - r)" }, { p: "RI_t = (ROE - r) \\times ", s: "", a: "B_{t-1}" }, { p: "RI_t = E_t - ", s: "", a: "(r \\times B_{t-1})" }]},
  { t: "Equity", c: "Residual Income Model (V_0)", n: "Valeur actuelle = Book Value + RI futurs.", v: [{ p: "V_0 = B_0 + ", s: "", a: "\\sum \\frac{RI_t}{(1+r)^t}" }, { p: "V_0 = ", s: " + \\sum \\frac{RI_t}{(1+r)^t}", a: "B_0" }]},
  { t: "Equity", c: "Excess Earnings Method", n: "Modèle de RI à croissance constante.", v: [{ p: "V_0 = B_0 + \\frac{", s: "}{r - g}", a: "B_0 \\times (ROE - r)" }, { p: "V_0 = B_0 + \\frac{B_0 \\times (ROE - r)}{", s: "}", a: "r - g" }]},
  { t: "Equity", c: "PV of Continuing Residual Income", n: "Valeur terminale avec facteur de persistance ω.", v: [{ p: "PV = \\frac{", s: "}{(1 + r - \\omega)(1 + r)^{T-1}}", a: "RI_T" }, { p: "PV = \\frac{RI_T}{(", s: ")(1 + r)^{T-1}}", a: "1 + r - \\omega" }]},
  { t: "Equity", c: "Market Value Added (MVA)", n: "Création de richesse globale.", v: [{ p: "MVA = \\text{Market Value} - ", s: "", a: "\\text{Book Value}" }, { p: "MVA = ", s: " - \\text{Book Value}", a: "\\text{Market Value}" }]},
  { t: "Equity", c: "Discount for Lack of Control (DLOC)", n: "Passe d'une valeur de contrôle à une valeur minoritaire.", v: [{ p: "Value_{Minority} = \\frac{Value_{Control}}{", s: "}", a: "1 + \\text{Control Premium}" }, { p: "Value_{Minority} = \\frac{", s: "}{1 + \\text{Control Premium}}", a: "Value_{Control}" }]},
  { t: "Equity", c: "Total Discount (DLOC & DLOM)", n: "Les décotes se composent, ne s'additionnent pas !", v: [{ p: "\\text{Total Discount} = 1 - \\left[ (1 - DLOC) \\times ", s: " \\right]", a: "(1 - DLOM)" }, { p: "\\text{Total Discount} = ", s: " - \\left[ (1 - DLOC) \\times (1 - DLOM) \\right]", a: "1" }]},
  { t: "Equity", c: "Multi-Stage Terminal Value", n: "Valeur terminale à la fin de la phase de forte croissance.", v: [{ p: "TV_n = \\frac{D_{n+1}}{", s: "}", a: "r - g_{long-term}" }, { p: "TV_n = \\frac{", s: "}{r - g_{long-term}}", a: "D_{n+1}" }]},
  { t: "Equity", c: "Equity Value & Price per Share", n: "Utiliser la Market Value de la dette !", v: [{ p: "\\text{Equity Value} = \\text{Firm Value} + \\text{NonOp Assets} - ", s: "", a: "\\text{Market Value of Debt}" }, { p: "\\text{Equity Value} = ", s: " + \\text{NonOp Assets} - \\text{Market Value of Debt}", a: "\\text{Firm Value}" }, { p: "\\text{Price} = \\frac{", s: "}{\\text{Shares Outstanding}}", a: "\\text{Equity Value}" }]},

  // --- 5. FIXED INCOME ---
  { t: "Fixed Income", c: "Forward Rate (No-Arbitrage Eq)", n: "Équation fondamentale (Multiplication).", v: [{ p: "(1+Z_{Total})^{Total} = (1+Z_{Attente})^{Attente} \\times ", s: "", a: "(1+F_{Attente, Duree})^{Duree}" }, { p: "(1+Z_{Total})^{Total} = ", s: " \\times (1+F_{Attente, Duree})^{Duree}", a: "(1+Z_{Attente})^{Attente}" }]},
  { t: "Fixed Income", c: "Binomial Bond Valuation Node", n: "Rétro-induction.", v: [{ p: "V_{\\text{node}} = \\frac{", s: "}{1 + fwd}", a: "0.5(V_{up} + V_{down}) + C" }, { p: "V_{\\text{node}} = \\frac{0.5(V_{up} + V_{down}) + C}{", s: "}", a: "1 + fwd" }]},
  { t: "Fixed Income", c: "Value of Callable Bond", n: "Option pour l'émetteur.", v: [{ p: "V_{\\text{callable}} = ", s: " - V_{\\text{call}}", a: "V_{\\text{straight}}" }, { p: "V_{\\text{callable}} = V_{\\text{straight}} - ", s: "", a: "V_{\\text{call}}" }]},
  { t: "Fixed Income", c: "Value of Putable Bond", n: "Option pour l'investisseur.", v: [{ p: "V_{\\text{putable}} = ", s: " + V_{\\text{put}}", a: "V_{\\text{straight}}" }, { p: "V_{\\text{putable}} = V_{\\text{straight}} + ", s: "", a: "V_{\\text{put}}" }]},
  { t: "Fixed Income", c: "Effective Duration", n: "Risque de taux pour obligations complexes.", v: [{ p: "\\text{EffDur} = \\frac{", s: "}{2 \\times \\Delta y \\times V_0}", a: "PV_- - PV_+" }, { p: "\\text{EffDur} = \\frac{PV_- - PV_+}{", s: "}", a: "2 \\times \\Delta y \\times V_0" }]},
  { t: "Fixed Income", c: "Effective Convexity", n: "Ajustement non linéaire.", v: [{ p: "\\text{EffCon} = \\frac{", s: "}{(\\Delta y)^2 \\times V_0}", a: "PV_- + PV_+ - 2PV_0" }, { p: "\\text{EffCon} = \\frac{PV_- + PV_+ - 2PV_0}{", s: "}", a: "(\\Delta y)^2 \\times V_0" }]},
  { t: "Fixed Income", c: "Credit Valuation Adjustment (CVA)", n: "Valeur du risque de crédit.", v: [{ p: "CVA = \\sum (", s: " \\times DF)", a: "EE \\times LGD \\times PD" }]},
  { t: "Fixed Income", c: "CDS Upfront Premium", n: "Payé à l'initiation.", v: [{ p: "\\text{Upfront} = (", s: ") \\times \\text{Dur}_{CDS}", a: "\\text{Spread} - \\text{Fixed coupon}" }, { p: "\\text{Upfront} = (\\text{Spread} - \\text{Fixed coupon}) \\times ", s: "", a: "\\text{Dur}_{CDS}" }]},
  { t: "Fixed Income", c: "P/L for Protection Buyer", n: "Gain si le spread s'élargit.", v: [{ p: "P/L = ", s: " \\times \\text{Notional}", a: "\\Delta \\text{Spread} \\times \\text{Dur}_{CDS}" }, { p: "P/L = \\Delta \\text{Spread} \\times \\text{Dur}_{CDS} \\times ", s: "", a: "\\text{Notional}" }]},
  { t: "Fixed Income", c: "Market Conversion Premium Ratio", n: "Prime payée vs valeur en actions de la convertible.", v: [{ p: "\\text{Market Premium Ratio} = \\frac{", s: "}{\\text{Conversion Value}}", a: "\\text{Convertible Bond Price} - \\text{Conversion Value}" }, { p: "\\text{Market Premium Ratio} = \\frac{\\text{Convertible Bond Price} - \\text{Conversion Value}}{", s: "}", a: "\\text{Conversion Value}" }]},
  { t: "Fixed Income", c: "Expected Loss & LGD", n: "LGD est la perte en cas de défaut, complémentaire du taux de recouvrement.", v: [{ p: "\\text{Expected Loss} = \\text{Exposure} \\times \\text{PD} \\times ", s: "", a: "\\text{LGD}" }, { p: "\\text{LGD} = 1 - ", s: "", a: "\\text{Recovery Rate}" }]},

  // --- 6. DERIVATIVES ---
  { t: "Derivatives", c: "FRA Rate (via PV factors)", n: "Sécurise un taux d'intérêt futur.", v: [{ p: "FRA(0, h, m) = \\left( ", s: " - 1 \\right) \\times \\frac{360}{m}", a: "\\frac{PV_h}{PV_{h+m}}" }, { p: "FRA(0, h, m) = \\left( \\frac{PV_h}{PV_{h+m}} - 1 \\right) \\times ", s: "", a: "\\frac{360}{m}" }]},
  { t: "Derivatives", c: "FRA Rate (via Spot Rates)", n: "Réannualiser à la fin !", v: [{ p: "FRA = \\left[ \\frac{", s: "}{1 + R_S \\times \\left( \\frac{D_S}{360} \\right)} - 1 \\right] \\times \\frac{360}{D_L - D_S}", a: "1 + R_L \\times \\left( \\frac{D_L}{360} \\right)" }, { p: "FRA = \\left[ \\frac{1 + R_L \\times \\left( \\frac{D_L}{360} \\right)}{", s: "} - 1 \\right] \\times \\frac{360}{D_L - D_S}", a: "1 + R_S \\times \\left( \\frac{D_S}{360} \\right)" }]},
  { t: "Derivatives", c: "Bond Forward/Futures Price", n: "Sac à dos : (Prix Plein × Taux) - Coupons - AI final, divisé par CF.", v: [{ p: "F_0 = ", s: " \\times \\left[ (S_0 + AI_0)\\left(1 + R_f \\times \\frac{jours}{360}\\right) - FV(Coupons) - AI_T \\right]", a: "\\frac{1}{CF}" }, { p: "F_0 = \\frac{1}{CF} \\times \\left[ ", s: " \\times \\left(1 + R_f \\times \\frac{jours}{360}\\right) - FV(Coupons) - AI_T \\right]", a: "(S_0 + AI_0)" }]},
  { t: "Derivatives", c: "Calendar Spread", n: "Spread négatif = Contango. Spread positif = Backwardation.", v: [{ p: "Calendar\\ Spread = ", s: " - F_{Farther}", a: "F_{Near}" }, { p: "Calendar\\ Spread = F_{Near} - ", s: "", a: "F_{Farther}" }, { p: "Spread < 0 \\implies F_{Farther} > F_{Near} \\implies ", s: "", a: "\\text{Contango}" }, { p: "Spread > 0 \\implies F_{Near} > F_{Farther} \\implies ", s: "", a: "\\text{Backwardation}" }]},
  { t: "Derivatives", c: "Mark-to-Market FX Forward", n: "(Nouveau Forward - Ancien) × Notionnel, actualisé au taux 'Price'.", v: [{ p: "V_{mtm} = \\frac{", s: "}{1 + R_{price} \\times \\frac{jours_{restants}}{360}}", a: "(F_t - F_0) \\times Notionnel" }, { p: "V_{mtm} = \\frac{(F_t - F_0) \\times Notionnel}{", s: "}", a: "1 + R_{price} \\times \\frac{jours_{restants}}{360}" }]},
  { t: "Derivatives", c: "Put-Call Parity", n: "Relation avec le Spot.", v: [{ p: "c + \\frac{X}{(1+R_f)^T} = ", s: "", a: "p + S_0" }, { p: "c + ", s: " = p + S_0", a: "\\frac{X}{(1+R_f)^T}" }]},
  { t: "Derivatives", c: "Put-Call Forward Parity", n: "Relation avec le Forward.", v: [{ p: "c + \\frac{X}{(1+R_f)^T} = p + ", s: "", a: "\\frac{F_0}{(1+R_f)^T}" }, { p: "c - p = ", s: "", a: "\\frac{F_0 - X}{(1+R_f)^T}" }]},
  { t: "Derivatives", c: "Forward Price (F_0)", n: "Prix d'équilibre fixé à l'initiation.", v: [{ p: "F_0 = (", s: ") \\times (1+R_f)^T", a: "S_0 - PV_{Ben} + PV_{Cost}" }, { p: "F_0 = (S_0 - PV_{Ben} + PV_{Cost}) \\times ", s: "", a: "(1+R_f)^T" }]},
  { t: "Derivatives", c: "Value of a Forward (via Spot)", n: "Valeur MTM en cours de vie.", v: [{ p: "V_t = S_t - PV_{Ben} + PV_{Cost} - ", s: "", a: "\\frac{F_0}{(1+R_f)^{T-t}}" }, { p: "V_t = ", s: " - \\frac{F_0}{(1+R_f)^{T-t}}", a: "S_t - PV_{Ben} + PV_{Cost}" }]},
  { t: "Derivatives", c: "Value of a Forward (via New Forward)", n: "Raccourci MTM (très utile).", v: [{ p: "V_t = \\frac{", s: "}{(1+R_f)^{T-t}}", a: "F_t - F_0" }, { p: "V_t = \\frac{F_t - F_0}{", s: "}", a: "(1+R_f)^{T-t}" }]},
  { t: "Derivatives", c: "Swap Fixed Rate", n: "Taux fixe d'équilibre.", v: [{ p: "r_{fix} = ", s: "", a: "\\frac{1 - PV_n}{\\sum PV_i}" }, { p: "r_{fix} = \\frac{", s: "}{\\sum PV_i}", a: "1 - PV_n" }, { p: "r_{fix} = \\frac{1 - PV_n}{", s: "}", a: "\\sum PV_i" }]},
  { t: "Derivatives", c: "Value of a Swap", n: "Valeur MTM du swap (Pay Fixed).", v: [{ p: "V_{swap} = NA \\times ", s: " \\times \\sum PV_i", a: "(FS_t - FS_0)" }, { p: "V_{swap} = NA \\times (FS_t - FS_0) \\times ", s: "", a: "\\sum PV_i" }]},
  { t: "Derivatives", c: "Value of a Swap (Bond Method)", n: "Pour le Receveur Fixe.", v: [{ p: "V_{swap} = NA \\times \\left[ \\left( \\sum_{i=1}^{n} R_{fixed} \\times PV_i \\right) + PV_n - ", s: " \\right]", a: "1" }, { p: "V_{swap} = NA \\times \\left[ \\left( \\sum_{i=1}^{n} R_{fixed} \\times PV_i \\right) + ", s: " - 1 \\right]", a: "PV_n" }]},
  { t: "Derivatives", c: "BSM Call Option", n: "Modèle Black-Scholes-Merton.", v: [{ p: "C = S \\times N(d_1) - ", s: "", a: "e^{-rt}X \\times N(d_2)" }, { p: "C = ", s: " - e^{-rt}X \\times N(d_2)", a: "S \\times N(d_1)" }]},
  { t: "Derivatives", c: "BSM Put Option", n: "Dérivé de Put-Call Parity.", v: [{ p: "P = ", s: " - S \\times N(-d_1)", a: "e^{-rt}X \\times N(-d_2)" }, { p: "P = e^{-rt}X \\times N(-d_2) - ", s: "", a: "S \\times N(-d_1)" }]},
  { t: "Derivatives", c: "Binomial Model: Up Factor", n: "Facteur u.", v: [{ p: "u = ", s: ", \\quad d = \\frac{1}{u}", a: "e^{\\sigma \\sqrt{\\Delta t}}" }, { p: "u = e^{\\sigma \\sqrt{\\Delta t}}, \\quad d = ", s: "", a: "\\frac{1}{u}" }]},
  { t: "Derivatives", c: "Binomial Model: Risk-Neutral Prob.", n: "Probabilité risque-neutre de hausse.", v: [{ p: "\\pi_U = \\frac{", s: "}{u - d}", a: "FV(1) - d" }, { p: "\\pi_U = \\frac{FV(1) - d}{", s: "}", a: "u - d" }]},
  { t: "Derivatives", c: "Binomial Model: Hedge Ratio", n: "Delta.", v: [{ p: "h = \\frac{", s: "}{S_+ - S_-}", a: "c_+ - c_-" }, { p: "h = \\frac{c_+ - c_-}{", s: "}", a: "S_+ - S_-" }]},
  { t: "Derivatives", c: "Equity Swap Value", n: "Swap payeur fixe / receveur action.", v: [{ p: "V_{\\text{Swap}} = ", s: "", a: "V_{\\text{Equity Leg}} - V_{\\text{Fixed Leg}}" }, { p: "V_{\\text{Swap}} = ", s: " - V_{\\text{Fixed Leg}}", a: "V_{\\text{Equity Leg}}" }]},
  { t: "Derivatives", c: "Equity Swap - Equity Leg", n: "S_t: actuel, S_{t-last}: dernier reset.", v: [{ p: "V_{\\text{Equity Leg}} = ", s: " \\times \\text{Notional}", a: "\\left( \\frac{S_t}{S_{t-\\text{last}}} \\right)" }]},
  { t: "Derivatives", c: "Equity Swap - Fixed Leg", n: "Valeur de la jambe fixe après l'initiation.", v: [{ p: "V_{\\text{Fixed Leg}} = \\left( ", s: " + 1 \\times PV_{\\text{last}} \\right) \\times \\text{Notional}", a: "\\text{Fixed Rate} \\times \\sum PV_{\\text{factors}}" }]},

  // --- 7. ALTS ---
  { t: "Alts", c: "Capitalization Rate (Real Estate)", n: "Yield de l'immobilier.", v: [{ p: "\\text{Cap Rate} = \\frac{", s: "}{\\text{Value}}", a: "NOI_1" }, { p: "\\text{Cap Rate} = \\frac{NOI_1}{", s: "}", a: "\\text{Value}" }, { p: "\\text{Value} = \\frac{", s: "}{\\text{Cap Rate}}", a: "NOI_1" }]},
  { t: "Alts", c: "Net Operating Income (NOI)", n: "Revenu avant impôts, intérêts, dépréciation.", v: [{ p: "NOI = \\text{Gross Rev} - \\text{Vacancy} - ", s: "", a: "\\text{Operating Expenses}" }, { p: "NOI = ", s: " - \\text{Vacancy} - \\text{Operating Expenses}", a: "\\text{Gross Rev}" }]},
  { t: "Alts", c: "Funds From Operations (FFO)", n: "Métrique de flux pour les REITs.", v: [{ p: "FFO = NI + D\\&A - ", s: "", a: "\\text{Net Gain on Sales}" }, { p: "FFO = ", s: " + D\\&A - \\text{Net Gain on Sales}", a: "NI" }]},
  { t: "Alts", c: "Adjusted FFO (AFFO)", n: "Plus précis (liquide) que le FFO.", v: [{ p: "AFFO = FFO - \\text{NonCash Rent} - ", s: "", a: "\\text{Recurring Capex}" }, { p: "AFFO = ", s: " - \\text{NonCash Rent} - \\text{Recurring Capex}", a: "FFO" }]},
  { t: "Alts", c: "REIT NAVPS", n: "Net Asset Value per Share.", v: [{ p: "NAVPS = \\frac{", s: "}{\\text{Shares}}", a: "(NOI / \\text{Cap Rate}) + \\text{Cash} - \\text{Debt}" }, { p: "NAV = ", s: " + \\text{Cash} - \\text{Debt}", a: "(NOI / \\text{Cap Rate})" }]},
  { t: "Alts", c: "VC Post-Money Valuation", n: "Valeur de la startup après injection.", v: [{ p: "POST = ", s: " + \\text{Investment}", a: "PRE" }, { p: "POST = PRE + ", s: "", a: "\\text{Investment}" }, { p: "PRE = ", s: " - \\text{Investment}", a: "POST" }]},
  { t: "Alts", c: "VC Fractional Ownership", n: "Pourcentage de détention acquis.", v: [{ p: "f = \\frac{", s: "}{POST}", a: "\\text{Investment}" }, { p: "f = \\frac{\\text{Investment}}{", s: "}", a: "POST" }]},
  { t: "Alts", c: "Commodities Roll Return", n: "Rendement du roulement des contrats à terme.", v: [{ p: "\\text{Roll Return} = \\frac{", s: "}{\\text{Expiring Price}}", a: "\\text{Expiring Price} - \\text{New Price}" }, { p: "\\text{Roll Return} = \\frac{\\text{Expiring Price} - \\text{New Price}}{", s: "}", a: "\\text{Expiring Price}" }]},

  // --- 8. PORTFOLIO MGT ---
  { t: "Portfolio Mgt", c: "Sharpe Ratio (SR)", n: "Rendement ajusté au risque total.", v: [{ p: "SR = \\frac{R_p - R_f}{", s: "}", a: "\\sigma_p" }, { p: "SR = \\frac{", s: "}{\\sigma_p}", a: "R_p - R_f" }]},
  { t: "Portfolio Mgt", c: "Treynor Ratio (TR)", n: "Rendement ajusté au risque systématique.", v: [{ p: "TR = \\frac{R_p - R_f}{", s: "}", a: "\\beta_p" }, { p: "TR = \\frac{", s: "}{\\beta_p}", a: "R_p - R_f" }]},
  { t: "Portfolio Mgt", c: "Sortino Ratio", n: "Ne pénalise que la volatilité à la baisse.", v: [{ p: "Sortino = \\frac{R_p - R_{target}}{", s: "}", a: "\\sigma_{downside}" }, { p: "Sortino = \\frac{", s: "}{\\sigma_{downside}}", a: "R_p - R_{target}" }]},
  { t: "Portfolio Mgt", c: "Information Ratio (IR)", n: "Performance active sur risque actif.", v: [{ p: "IR = \\frac{R_p - R_b}{", s: "} = \\frac{R_p - R_b}{\\sigma_{p-b}}", a: "\\text{Active Risk}" }, { p: "IR = \\frac{R_p - R_b}{\\text{Active Risk}} = \\frac{", s: "}{\\sigma_{p-b}}", a: "R_p - R_b" }]},
  { t: "Portfolio Mgt", c: "Fundamental Law of Active Mgt", n: "Talent x Opportunité x Exécution.", v: [{ p: "IR = TC \\times IC \\times ", s: "", a: "\\sqrt{BR}" }, { p: "IR = ", s: " \\times IC \\times \\sqrt{BR}", a: "TC" }, { p: "IR = TC \\times ", s: " \\times \\sqrt{BR}", a: "IC" }]},
  { t: "Portfolio Mgt", c: "Expected Active Return", n: "IR fois Risque Actif.", v: [{ p: "E(R_A) = IR \\times ", s: "", a: "\\sigma_A" }, { p: "E(R_A) = ", s: " \\times \\sigma_A", a: "IR" }]},
  { t: "Portfolio Mgt", c: "Optimal Active Risk", n: "Pour maximiser le SR global.", v: [{ p: "\\sigma_A^* = \\frac{IR}{", s: "} \\times \\sigma_B", a: "SR_B" }, { p: "\\sigma_A^* = \\frac{", s: "}{SR_B} \\times \\sigma_B", a: "IR" }]},
  { t: "Portfolio Mgt", c: "Optimal Weight of Active Portfolio", n: "Risque actif optimal / Risque actif actuel.", v: [{ p: "W_A = \\frac{", s: "}{\\sigma_{A,\\ actuel}}", a: "\\sigma_A^*" }, { p: "W_A = \\frac{\\sigma_A^*}{", s: "}", a: "\\sigma_{A,\\ actuel}" }]},
  { t: "Portfolio Mgt", c: "Maximum Sharpe Ratio", n: "Ratio combiné optimal.", v: [{ p: "SR_{max} = \\sqrt{", s: " + IR^2}", a: "SR_B^2" }, { p: "SR_{max} = \\sqrt{SR_B^2 + ", s: "}", a: "IR^2" }]},
  { t: "Portfolio Mgt", c: "Ex-Ante Alpha", n: "Prédiction de l'Alpha généré.", v: [{ p: "\\alpha = IC \\times \\sqrt{BR} \\times ", s: " \\times TC", a: "\\sigma_A" }, { p: "\\alpha = ", s: " \\times \\sqrt{BR} \\times \\sigma_A \\times TC", a: "IC" }]},
  { t: "Portfolio Mgt", c: "Grinold-Kroner ERP", n: "Equity Risk Premium estimé.", v: [{ p: "ERP = ", s: " - R_f", a: "(DY + \\Delta P/E + i + g)" }]},
  { t: "Portfolio Mgt", c: "Expected Return via APT", n: "Modèle multifactoriel.", v: [{ p: "E(R) = R_f + ", s: "", a: "(\\beta_1 \\times \\lambda_1) + (\\beta_2 \\times \\lambda_2)" }, { p: "E(R) = ", s: " + (\\beta_1 \\times \\lambda_1) + (\\beta_2 \\times \\lambda_2)", a: "R_f" }]},
  { t: "Portfolio Mgt", c: "Relative Strength", n: "Compare la performance d'une action vs un indice.", v: [{ p: "\\text{Rel Strength} = \\frac{", s: "}{\\left( \\frac{I_1}{I_0} \\right)_{\\text{Index}}}", a: "\\left( \\frac{P_1}{P_0} \\right)_{\\text{Stock}}" }]},
  { t: "Portfolio Mgt", c: "Value at Risk (VaR) - Parametric", n: "Perte maximale pour un seuil de confiance.", v: [{ p: "VaR = \\left[ E(R_p) - ", s: " \\right] \\times V_p", a: "(z \\times \\sigma_p)" }, { p: "VaR = \\left[ ", s: " - (z \\times \\sigma_p) \\right] \\times V_p", a: "E(R_p)" }]},
  { t: "Portfolio Mgt", c: "Brinson: Pure Sector Allocation", n: "Effet de l'allocation (sur/sous-pondérer un secteur).", v: [{ p: "R_{alloc} = \\sum (W_p - W_b) ", s: "", a: "(R_{b,i} - R_b)" }, { p: "R_{alloc} = \\sum ", s: " (R_{b,i} - R_b)", a: "(W_p - W_b)" }]},
  { t: "Portfolio Mgt", c: "Brinson: Selection", n: "Effet du choix des titres au sein d'un secteur.", v: [{ p: "R_{select} = \\sum W_b ", s: "", a: "(R_{p,i} - R_{b,i})" }]}
];

const AVAILABLE_TOPICS = [...new Set(RAW_DATABASE.map(item => item.t))];

const PRESET_BUNDLE_A = ["Quant & Econ", "FSA", "Fixed Income", "Alts"];
const PRESET_BUNDLE_B = ["Corp Issuers", "Equity", "Derivatives", "Portfolio Mgt"];

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
        correctAnswer: variation.a
      });
    });
  });
  return expanded;
};

const FULL_DATABASE = expandDatabase(RAW_DATABASE);

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// --- MASTERY SYSTEM ---
const MAX_LEVEL = 7;
const MASTERY_WEIGHTS = [10, 7, 5, 3.5, 2.5, 1.8, 1.3, 1];
const STORAGE_KEY = 'formula_mastery_v1';

const weightFromLevel = (level) => {
  const l = Math.max(0, Math.min(MAX_LEVEL, level ?? 4));
  return MASTERY_WEIGHTS[l];
};

const categorizeLevel = (level) => {
  if (level == null) return 'unseen';
  if (level < 3) return 'weak';
  if (level < 5) return 'learning';
  return 'mastered';
};

const weightedShuffle = (items, getWeight) => {
  return items
    .map(item => ({
      item,
      key: -Math.log(Math.random() || 1e-9) / Math.max(0.01, getWeight(item))
    }))
    .sort((a, b) => a.key - b.key)
    .map(x => x.item);
};

// --- KATEX RENDERER ---
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

// --- DRAWING CANVAS COMPONENT ---
const DrawingCanvas = forwardRef(({ disabled, height = 260 }, ref) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const [hasContent, setHasContent] = useState(false);
  const [inkColor, setInkColor] = useState('#f1f5f9');

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  useEffect(() => {
    setupCanvas();
    const handleResize = () => setupCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasContent(false);
  };

  useImperativeHandle(ref, () => ({ clear, hasContent: () => hasContent }));

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: e.pressure && e.pressure > 0 ? e.pressure : 0.5
    };
  };

  const handlePointerDown = (e) => {
    if (disabled) return;
    e.preventDefault();
    canvasRef.current.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    lastPointRef.current = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    const p = lastPointRef.current;
    const r = Math.max(1.2, p.pressure * 2.5);
    ctx.fillStyle = inkColor;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
    setHasContent(true);
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current || disabled) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const current = getPos(e);
    const last = lastPointRef.current;

    const lineWidth = Math.max(1.2, current.pressure * 3.8);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = inkColor;

    const midX = (last.x + current.x) / 2;
    const midY = (last.y + current.y) / 2;

    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.quadraticCurveTo(last.x, last.y, midX, midY);
    ctx.stroke();

    lastPointRef.current = current;
  };

  const handlePointerUp = (e) => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      lastPointRef.current = null;
      try { canvasRef.current.releasePointerCapture(e.pointerId); } catch {}
    }
  };

  const colors = [
    { name: 'Blanc',  value: '#f1f5f9' },
    { name: 'Rose',   value: '#fb7185' },
    { name: 'Ambre',  value: '#fbbf24' },
    { name: 'Emerald',value: '#34d399' }
  ];

  return (
    <div ref={containerRef} className="relative w-full">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full bg-slate-950 rounded-2xl border-2 border-dashed border-slate-700 cursor-crosshair"
        style={{ touchAction: 'none', height: `${height}px` }}
      />

      {!hasContent && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center text-slate-700">
            <div className="text-3xl mb-1">✍️</div>
            <p className="text-xs uppercase tracking-widest font-semibold">Écris la réponse ici</p>
          </div>
        </div>
      )}

      <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur px-2 py-1.5 rounded-lg border border-slate-800">
        {colors.map(c => (
          <button
            key={c.value}
            onClick={() => setInkColor(c.value)}
            className={`w-5 h-5 rounded-full border-2 transition-all ${inkColor === c.value ? 'border-white scale-110' : 'border-slate-700 hover:border-slate-500'}`}
            style={{ backgroundColor: c.value }}
            title={c.name}
          />
        ))}
        <div className="w-px h-5 bg-slate-700 mx-1"></div>
        <button
          onClick={clear}
          className="text-slate-400 hover:text-rose-400 transition-colors px-1.5 py-0.5 text-sm"
          title="Effacer"
        >
          🗑
        </button>
      </div>
    </div>
  );
});

export default function App() {
  const [gameState, setGameState] = useState('start');
  const [selectedTopics, setSelectedTopics] = useState(AVAILABLE_TOPICS);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [mistakes, setMistakes] = useState([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasGraded, setHasGraded] = useState(false);

  // Async persistent storage via window.storage
  const [mastery, setMastery] = useState({});
  const [storageLoaded, setStorageLoaded] = useState(false);
  const [resetConfirming, setResetConfirming] = useState(false);

  const [isWeaknessMode, setIsWeaknessMode] = useState(false);
  const canvasRef = useRef(null);

  // Load mastery from persistent storage on mount
  useEffect(() => {
    const load = async () => {
      try {
        const result = await window.storage.get(STORAGE_KEY, false);
        if (result?.value) {
          setMastery(JSON.parse(result.value));
        }
      } catch (e) {
        // Key doesn't exist yet — start fresh, that's fine
      }
      setStorageLoaded(true);
    };
    load();
  }, []);

  // Persist mastery on change (only after initial load to avoid wiping data)
  useEffect(() => {
    if (!storageLoaded) return;
    window.storage.set(STORAGE_KEY, JSON.stringify(mastery), false).catch((e) => {
      console.error('Could not save mastery', e);
    });
  }, [mastery, storageLoaded]);

  const weakConcepts = (() => {
    const allConcepts = [...new Set(RAW_DATABASE.map(d => d.c))];
    return allConcepts.filter(c => {
      const m = mastery[c];
      return !m || m.level < 3;
    });
  })();

  const masteryStats = (() => {
    const allConcepts = [...new Set(RAW_DATABASE.map(d => d.c))];
    const stats = { weak: 0, learning: 0, mastered: 0, unseen: 0 };
    allConcepts.forEach(c => {
      const cat = categorizeLevel(mastery[c]?.level);
      stats[cat]++;
    });
    return stats;
  })();

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
        next.level = Math.max(0, current.level - 2);
      }
      return { ...prev, [concept]: next };
    });
  };

  const handleReset = async () => {
    if (!resetConfirming) {
      setResetConfirming(true);
      setTimeout(() => setResetConfirming(false), 3000);
      return;
    }
    setMastery({});
    try { await window.storage.delete(STORAGE_KEY, false); } catch (e) {}
    setResetConfirming(false);
  };

  const activeVariationsCount = FULL_DATABASE.filter(q => selectedTopics.includes(q.topic)).length;

  const applyPreset = (preset) => {
    if (preset === 'all') setSelectedTopics(AVAILABLE_TOPICS);
    else if (preset === 'none') setSelectedTopics([]);
    else if (preset === 'bundleA') setSelectedTopics(PRESET_BUNDLE_A);
    else if (preset === 'bundleB') setSelectedTopics(PRESET_BUNDLE_B);
  };

  const startGame = (mode = 'normal') => {
    let filteredDB = [];

    if (mode === 'weaknesses') {
      filteredDB = FULL_DATABASE.filter(q => weakConcepts.includes(q.concept));
      setIsWeaknessMode(true);
    } else {
      if (selectedTopics.length === 0) return;
      filteredDB = FULL_DATABASE.filter(q => selectedTopics.includes(q.topic));
      setIsWeaknessMode(false);
    }

    if (filteredDB.length === 0) return;

    const orderedDB = mode === 'weaknesses'
      ? shuffleArray(filteredDB)
      : weightedShuffle(filteredDB, q => weightFromLevel(mastery[q.concept]?.level));

    setQuestions(orderedDB);
    setCurrentIndex(0);
    setQuestionsAnswered(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setMistakes([]);
    setIsRevealed(false);
    setHasGraded(false);
    setGameState('playing');
  };

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleSelfGrade = (isCorrect) => {
    if (hasGraded) return;
    setHasGraded(true);

    const currentQ = questions[currentIndex];

    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(max => Math.max(max, newStreak));
        return newStreak;
      });
    } else {
      setStreak(0);
      setMistakes(prev => [...prev, currentQ]);
    }

    updateMastery(currentQ.concept, isCorrect);
    setQuestionsAnswered(prev => prev + 1);

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(prev => prev + 1);
        setIsRevealed(false);
        setHasGraded(false);
        if (canvasRef.current) canvasRef.current.clear();
      } else {
        setGameState('result');
      }
    }, 400);
  };

  const endGameEarly = () => {
    setGameState('result');
  };

  // --- LOADING SCREEN ---
  if (!storageLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-500 animate-pulse text-sm uppercase tracking-widest">Loading…</div>
      </div>
    );
  }

  // --- START SCREEN ---
  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col items-center justify-center p-4 md:p-6">
        <div className="max-w-2xl w-full space-y-6 bg-slate-900 p-6 md:p-10 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Finance Formula Trainer <br/><span className="text-indigo-400">Handwriting Mode ✍️</span></h1>
            <p className="text-xs text-slate-500 mt-3 font-mono">
              Free &amp; open-source · MIT/CC&nbsp;BY · Not exhaustive, not officially vetted
            </p>
            <p className="text-base md:text-lg text-slate-400 mt-4">
              Active recall au stylet. Écris la réponse à la main, puis auto-évalue-toi. Plus exigeant qu'un QCM, et bien plus efficace pour ancrer les formules.
            </p>
          </div>

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
                    onClick={handleReset}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                      resetConfirming
                        ? 'bg-rose-600 hover:bg-rose-500 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                    }`}
                    title="Réinitialiser la progression"
                  >
                    {resetConfirming ? 'Sûr ?' : '✕'}
                  </button>
                )}
              </div>
            </div>

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
            <div className="space-y-3">
              <p className="text-sm text-slate-400 uppercase font-semibold tracking-wider">Topic Presets</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => applyPreset('bundleA')} className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-semibold py-2 px-3 rounded-lg text-sm transition-colors">
                  Bundle A
                  <span className="block text-[10px] font-normal text-blue-400/70 mt-0.5">Quant · FSA · FI · Alts</span>
                </button>
                <button onClick={() => applyPreset('bundleB')} className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 font-semibold py-2 px-3 rounded-lg text-sm transition-colors">
                  Bundle B
                  <span className="block text-[10px] font-normal text-amber-400/70 mt-0.5">Corp · Equity · Deriv · PM</span>
                </button>
              </div>
              <div className="flex justify-between items-center pt-2">
                <button onClick={() => applyPreset('all')} className="text-xs text-slate-500 hover:text-white transition-colors underline">Select All</button>
                <button onClick={() => applyPreset('none')} className="text-xs text-slate-500 hover:text-white transition-colors underline">Deselect All</button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <p className="text-sm text-slate-400 uppercase font-semibold tracking-wider mb-3">Manual Selection</p>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TOPICS.map(topic => {
                  const isSelected = selectedTopics.includes(topic);
                  return (
                    <button
                      key={topic}
                      onClick={() => {
                        if (isSelected) setSelectedTopics(prev => prev.filter(t => t !== topic));
                        else setSelectedTopics(prev => [...prev, topic]);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all border ${
                        isSelected
                          ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50'
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

          <button
            onClick={() => startGame('normal')}
            disabled={selectedTopics.length === 0}
            className={`w-full font-bold py-4 px-8 rounded-xl transition-all duration-200 transform ${
              selectedTopics.length > 0
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-[1.02] shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {selectedTopics.length > 0 ? "Lancer le Sprint ✍️" : "Sélectionne au moins un topic"}
          </button>

          <div className="text-center pt-2 space-y-1">
            <p className="text-xs text-slate-500 italic">
              Astuce : iPad + Apple Pencil, Surface + Stylet, ou ton doigt. La pression est détectée pour un trait naturel.
            </p>
            <p className="text-[10px] text-slate-600">
              Built with Claude. Content curation, formula selection and notes are mine.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- RESULT SCREEN ---
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
                <p className="text-xs text-slate-500 mt-1">sur {questions.length} variations ciblées</p>
              </div>
              <div className="bg-slate-900 px-6 py-4 rounded-2xl border border-slate-800">
                <p className="text-sm text-slate-500 uppercase">Max Streak</p>
                <p className="text-4xl font-black text-amber-500">{maxStreak} 🔥</p>
              </div>
            </div>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              {total === 0
                ? "Tu as arrêté avant même de répondre !"
                : isPass
                ? "Excellent ratio. Tes formules sont ancrées en mémoire active."
                : "Le recall a révélé tes angles morts. Revois les concepts ci-dessous."}
            </p>
          </div>

          {mistakes.length > 0 && (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
              <div className="bg-slate-800/50 p-6 border-b border-slate-800">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-rose-500">⚠</span> {mistakes.length} Concepts à Revoir
                </h3>
              </div>
              <div className="divide-y divide-slate-800/50">
                {mistakes.map((m, idx) => (
                  <div key={idx} className="p-6 space-y-4 hover:bg-slate-800/20 transition-colors">
                    <div>
                      <span className="text-xs font-bold px-2 py-1 bg-slate-800 text-slate-400 rounded-md uppercase tracking-wide">
                        {m.topic}
                      </span>
                      <h4 className="text-lg font-bold text-white mt-2">{m.concept}</h4>
                    </div>

                    <div className="bg-slate-950 px-4 py-6 rounded-xl border border-slate-800/80 overflow-x-auto overflow-y-visible text-center">
                      <LatexRenderer math={`${m.formulaPrefix}\\color{#10b981}{${m.correctAnswer}}${m.formulaSuffix}`} inline={false} />
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
              Relancer ce Sprint
            </button>
            <button
              onClick={() => setGameState('start')}
              className="bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold py-4 px-8 rounded-xl transition-all duration-200 border border-slate-800"
            >
              Changer de Topics
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- PLAYING SCREEN ---
  const currentQ = questions[currentIndex];
  const progressPercent = ((currentIndex) / questions.length) * 100;

  const blankDisplay = '\\colorbox{#1e293b}{\\color{#64748b}{\\ ?\\ }}';
  const promptMath = `${currentQ.formulaPrefix}${blankDisplay}${currentQ.formulaSuffix}`;
  const revealMath = `${currentQ.formulaPrefix}\\color{#10b981}{${currentQ.correctAnswer}}${currentQ.formulaSuffix}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center p-4 md:p-8">
      {/* HUD */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-slate-800 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-300">
            Q: {currentIndex + 1} <span className="text-slate-500">/ {questions.length}</span>
          </div>
          <div className="hidden md:block w-32 lg:w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <div className="flex gap-4 md:gap-6 items-center">
          <button onClick={endGameEarly} className="text-sm font-semibold text-slate-400 hover:text-rose-400 transition-colors px-3 py-1 rounded-md hover:bg-rose-500/10">
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

      {/* Question card */}
      <div className="w-full max-w-4xl flex flex-col flex-grow space-y-6">
        <div className="bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl flex flex-col items-center text-center space-y-5 relative overflow-hidden">
          <span className="inline-block bg-indigo-500/10 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            {currentQ.topic}
          </span>

          <h2 className="text-2xl md:text-4xl font-bold text-white">
            {currentQ.concept}
          </h2>

          <p className="text-slate-400 max-w-2xl text-base md:text-lg">
            {currentQ.notes}
          </p>

          <div className="w-full bg-slate-950 py-8 px-2 md:px-6 rounded-2xl border border-slate-800 shadow-inner flex justify-center items-center overflow-x-auto overflow-y-visible min-h-[140px]">
            <LatexRenderer inline={false} math={isRevealed ? revealMath : promptMath} />
          </div>
        </div>

        {/* Drawing zone */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-slate-500 font-semibold px-1">
            <span>Ta réponse manuscrite</span>
            <span className="text-slate-600">{isRevealed ? "✓ Réponse révélée — compare et auto-évalue" : "Prends ton temps. Visualise avant d'écrire."}</span>
          </div>
          <DrawingCanvas ref={canvasRef} disabled={hasGraded} height={240} />
        </div>

        {/* Action zone */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
          {!isRevealed ? (
            <button
              onClick={handleReveal}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.01] shadow-[0_0_20px_rgba(99,102,241,0.3)]"
            >
              👁 Révéler la réponse
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-center text-sm text-slate-400">Compare ta réponse manuscrite à la bonne réponse ci-dessus. Sois honnête.</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSelfGrade(false)}
                  disabled={hasGraded}
                  className={`font-bold py-4 px-6 rounded-xl transition-all duration-200 border-2 ${
                    hasGraded
                      ? 'opacity-50 cursor-not-allowed bg-slate-800 border-slate-700 text-slate-500'
                      : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/40 hover:border-rose-500 transform hover:scale-[1.02]'
                  }`}
                >
                  ✗ Raté
                </button>
                <button
                  onClick={() => handleSelfGrade(true)}
                  disabled={hasGraded}
                  className={`font-bold py-4 px-6 rounded-xl transition-all duration-200 border-2 ${
                    hasGraded
                      ? 'opacity-50 cursor-not-allowed bg-slate-800 border-slate-700 text-slate-500'
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:border-emerald-500 transform hover:scale-[1.02]'
                  }`}
                >
                  ✓ Juste
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
