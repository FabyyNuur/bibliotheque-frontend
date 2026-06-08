package com.biblio.selenium.tests;

import com.biblio.selenium.pages.BookListPage;
import com.biblio.selenium.pages.LoginPage;
import com.biblio.selenium.pages.RegisterPage;
import com.biblio.selenium.utils.TestDataFactory;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

class ErrorHandlingTest extends BaseTest {

    @Test
    void rechercheSansResultatAfficheEtatVide() {
        BookListPage bookListPage = new BookListPage(driver);
        bookListPage.open();
        bookListPage.search("xyzlivreinexistant99999");

        Assertions.assertThat(bookListPage.isEmptyStateDisplayed()).isTrue();
    }

    @Test
    void loginVideResteSurPageConnexion() {
        loginPage.open();
        loginPage.login("", "");

        Assertions.assertThat(loginPage.isDisplayed()).isTrue();
    }

    @Test
    void inscriptionMotDePasseTropCourt() {
        RegisterPage registerPage = new RegisterPage(driver);
        registerPage.open();
        registerPage.registerWithMismatchPassword(
                "Court", "Test", TestDataFactory.uniqueEmail("short"),
                "abc", "abc"
        );

        Assertions.assertThat(registerPage.isDisplayed()).isTrue();
    }
}
