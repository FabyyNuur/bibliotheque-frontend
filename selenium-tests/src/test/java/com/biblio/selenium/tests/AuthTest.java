package com.biblio.selenium.tests;

import com.biblio.selenium.config.TestConfig;
import com.biblio.selenium.pages.DashboardPage;
import com.biblio.selenium.utils.WaitUtils;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.support.ui.ExpectedConditions;

class AuthTest extends BaseTest {

    @Test
    void connexionBibliothecaireRedirigeVersDashboard() {
        loginAsBiblio();

        DashboardPage dashboardPage = new DashboardPage(driver);
        Assertions.assertThat(dashboardPage.isDisplayed()).isTrue();
        Assertions.assertThat(navbarPage.isLogoutVisible()).isTrue();
    }

    @Test
    void connexionIdentifiantsInvalidesAfficheErreur() {
        loginPage.open();
        loginPage.login("invalid@test.com", "wrongpass");

        Assertions.assertThat(loginPage.hasError()).isTrue();
        Assertions.assertThat(loginPage.getErrorMessage()).isNotBlank();
    }

    @Test
    void deconnexionRetourneNavigationInvite() {
        loginAsBiblio();
        navbarPage.logout();

        Assertions.assertThat(navbarPage.isLoginLinkVisible()).isTrue();
        Assertions.assertThat(navbarPage.isLogoutVisible()).isFalse();
    }

    @Test
    void routeInscriptionRedirigeVersConnexion() {
        driver.get(TestConfig.getBaseUrl() + "/register");

        WaitUtils.createWait(driver).until(ExpectedConditions.urlContains("/login"));
        Assertions.assertThat(loginPage.isDisplayed()).isTrue();
    }

    @Test
    void lecteurCreeParBibliothecairePeutSeConnecter() {
        loginAsBiblio();
        String email = createLecteurAsBiblio("Dupont", "Marie");
        navbarPage.logout();

        loginAsNewLecteur(email);

        DashboardPage dashboardPage = new DashboardPage(driver);
        Assertions.assertThat(dashboardPage.isDisplayed()).isTrue();
        Assertions.assertThat(navbarPage.isLogoutVisible()).isTrue();
    }
}
