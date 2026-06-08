package com.biblio.selenium.tests;

import com.biblio.selenium.pages.BookListPage;
import com.biblio.selenium.pages.ChangePasswordPage;
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
    void changementMotDePasseTropCourtAfficheErreur() {
        loginAsBiblio();
        String email = createLecteurAsBiblio("Court", "Test");
        navbarPage.logout();

        loginPage.open();
        loginPage.login(email, TestDataFactory.defaultTemporaryPassword());

        ChangePasswordPage changePasswordPage = new ChangePasswordPage(driver);
        Assertions.assertThat(changePasswordPage.isDisplayed()).isTrue();
    }
}
