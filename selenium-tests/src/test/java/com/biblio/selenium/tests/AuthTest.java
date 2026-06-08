package com.biblio.selenium.tests;

import com.biblio.selenium.pages.DashboardPage;
import com.biblio.selenium.pages.RegisterPage;
import com.biblio.selenium.utils.TestDataFactory;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

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
    void inscriptionLecteurRedirigeVersDashboard() {
        RegisterPage registerPage = new RegisterPage(driver);
        String email = TestDataFactory.uniqueEmail("register");

        registerPage.open();
        registerPage.register("Dupont", "Marie", email, TestDataFactory.defaultPassword());

        DashboardPage dashboardPage = new DashboardPage(driver);
        Assertions.assertThat(dashboardPage.isDisplayed()).isTrue();
        Assertions.assertThat(navbarPage.isLogoutVisible()).isTrue();
    }

    @Test
    void inscriptionMotsDePasseDifferentsAfficheErreur() {
        RegisterPage registerPage = new RegisterPage(driver);
        registerPage.open();
        registerPage.registerWithMismatchPassword(
                "Test", "User", TestDataFactory.uniqueEmail("mismatch"),
                "secret123", "different"
        );

        Assertions.assertThat(registerPage.getErrorMessage())
                .contains("ne correspondent pas");
    }
}
