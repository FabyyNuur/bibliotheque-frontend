package com.biblio.selenium.tests;

import com.biblio.selenium.pages.BookListPage;
import com.biblio.selenium.pages.MesEmpruntsPage;
import com.biblio.selenium.pages.ProfilePage;
import com.biblio.selenium.pages.RegisterPage;
import com.biblio.selenium.utils.TestDataFactory;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class LecteurFlowTest extends BaseTest {

    private String lecteurEmail;
    private String bookTitle;

    @BeforeEach
    void prepareLecteurAndBook() {
        lecteurEmail = TestDataFactory.uniqueEmail("lecteur");
        bookTitle = "Livre Selenium " + System.currentTimeMillis();

        loginAsBiblio();
        BookListPage bookListPage = new BookListPage(driver);
        bookListPage.open();
        bookListPage.createBook(
                bookTitle,
                "Auteur Test",
                TestDataFactory.uniqueIsbn(),
                "Test"
        );
        navbarPage.logout();

        RegisterPage registerPage = new RegisterPage(driver);
        registerPage.open();
        registerPage.register("Lecteur", "Test", lecteurEmail, TestDataFactory.defaultPassword());
    }

    @Test
    void parcoursEmpruntEtMesEmprunts() {
        BookListPage bookListPage = new BookListPage(driver);
        bookListPage.open();
        bookListPage.search(bookTitle);
        Assertions.assertThat(bookListPage.bookExists(bookTitle)).isTrue();
        bookListPage.clickBorrowOnFirstAvailable();

        MesEmpruntsPage mesEmpruntsPage = new MesEmpruntsPage(driver);
        mesEmpruntsPage.open();
        mesEmpruntsPage.waitForBookInTable(bookTitle);
        Assertions.assertThat(mesEmpruntsPage.isDisplayed()).isTrue();
        Assertions.assertThat(mesEmpruntsPage.tableContainsBook(bookTitle)).isTrue();
        Assertions.assertThat(mesEmpruntsPage.getTableText()).containsAnyOf("En cours", "EN_COURS", "EN COURS");
    }

    @Test
    void modificationProfil() {
        ProfilePage profilePage = new ProfilePage(driver);
        profilePage.open();
        profilePage.updateNom("NouveauNom");

        Assertions.assertThat(profilePage.getSuccessMessage())
                .contains("mis à jour");
    }
}
