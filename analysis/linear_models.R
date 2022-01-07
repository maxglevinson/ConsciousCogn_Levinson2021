# Uniformity illusion online psychophysics
# Linear fixed effects models of filling-in behavior
# Predictors: border eccentricity (size of the central disk), luminance contrast (periphery luminance)

# load packages
library(lme4)
library(sjPlot) # not necessary for analysis, just to get a quick model summary via tab_model

# load data
setwd("ROOTDIR/data") # replace ROOTDIR with your local path
df_full <- read.csv('./full_behavior.csv',sep = ",",stringsAsFactors = FALSE)

# take out control trials
df = df_full[df_full$luminance != 1 & df_full$luminance != 2, ]

###### MODEL 1: REACTION TIME ######
# fit stepwise linear regressions
lm0 = lm(RT ~ 1, df)
lm1 = lm(RT ~ eccentricity, df)
lm2 = lm(RT ~ luminance, df)
lm3 = lm(RT ~ eccentricity + luminance, df)
lm4 = lm(RT ~ eccentricity + luminance + eccentricity:luminance, df)

# model selection via chi-sq
anova(lm0, lm1, lm3, lm4, test = "Chi")

# compute Bayes factor between the two best-fitting models
exp((BIC(lm3) - BIC(lm4))/2) # evidence for including interaction

# view results of selected model
summary(lm4)
tab_model(lm4, show.se = TRUE, show.loglik = TRUE, dv.labels = "", title = "Linear model: Filling-in reaction time")



###### MODEL 2: FILLING-IN LIKELIHOOD ######
# get binary response (click or no click)
df_clicks <- df
names(df_clicks)[names(df_clicks) == "RT"] <- "clicked"
df_clicks["clicked"][df_clicks["clicked"] > 0.001] <- 1
df_clicks[is.na(df_clicks)] <- 0

# fit stepwise logistic regressions
lm0=glm(clicked ~ 1, df_clicks, family = "binomial")
lm1=glm(clicked ~ eccentricity, df_clicks, family = "binomial")
lm2=glm(clicked ~ luminance, df_clicks, family = "binomial")
lm3=glm(clicked ~ eccentricity + luminance, df_clicks, family = "binomial")
lm4=glm(clicked ~ eccentricity + luminance + eccentricity:luminance, df_clicks, family = "binomial")

# model selection via chi-sq
#anova(lm0, lm1, lm2, lm3, lm4, test = "Chisq")
anova(lm4, test = "Chisq") # tests each new added parameter. Gives same conclusion as above command

# compute Bayes factor between the two best-fitting models
exp((BIC(lm3) - BIC(lm4))/2) # evidence against adding interaction

# view results of selected model
summary(lm3)
tab_model(lm3, show.loglik = TRUE, dv.labels = "", title = "Linear model: Filling-in likelihood")




###### MODEL 3: FILLING-IN DIRECTION ######
# fit stepwise logistic regressions
lm0=glm(center_changed ~ 1, df, family = "binomial")
lm1=glm(center_changed ~ eccentricity, df, family = "binomial")
lm2=glm(center_changed ~ luminance, df, family = "binomial")
lm3=glm(center_changed ~ eccentricity + luminance, df, family = "binomial")
lm4=glm(center_changed ~ eccentricity + luminance + eccentricity:luminance, df, family = "binomial")

# model selection via chi-sq
#anova(lm0, lm1, lm2, lm3, lm4, test = "Chisq")
anova(lm4, test = "Chisq")

# compute Bayes factor between the two best-fitting models
exp((BIC(lm1) - BIC(lm3))/2) # inconclusive evidence

# view results of selected model
summary(lm1)
tab_model(lm1, show.se = TRUE, show.loglik = TRUE, dv.labels = "", title = "Linear model: Filling-in direction")
