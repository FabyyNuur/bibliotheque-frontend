package com.biblio.selenium.tests;

import com.biblio.selenium.pages.BookListPage;
import com.biblio.selenium.pages.EmpruntListPage;
import com.biblio.selenium.pages.UserListPage;
import com.biblio.selenium.utils.TestDataFactory;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class BibliothecaireFlowTest extends BaseTest {

    private String bookTitle;
    private String lecteurEmail;

    @BeforeEach
    void loginBiblio() {
        loginAsBiblio();
        bookTitle = "Biblio Book " + System.currentTimeMillis();
        lecteurEmail = TestDataFactory.uniqueEmail("biblio-lecteur");
    }

    @Test
    void crudLivreComplet() {
        BookListPage bookListPage = new BookListPage(driver);
        bookListPage.open();
        bookListPage.createBook(bookTitle, "Auteur CRUD", TestDataFactory.uniqueIsbn(), "Roman");

        Assertions.assertThat(bookListPage.bookExists(bookTitle)).isTrue();

        String updatedTitle = bookTitle + " Modifié";
        bookListPage.clickEditOnBook(bookTitle);
        bookListPage.updateBookTitle(updatedTitle);
        bookListPage.search(updatedTitle);
        Assertions.assertThat(bookListPage.bookExists(updatedTitle)).isTrue();

        bookListPage.clickDeleteOnBook(updatedTitle);
        bookListPage.search(updatedTitle);
        Assertions.assertThat(bookListPage.bookExists(updatedTitle)).isFalse();
    }

    @Test
    void creationUtilisateurEtEmprunt() {
        UserListPage userListPage = new UserListPage(driver);
        userListPage.open();
        userListPage.createUser("Sel", "User", lecteurEmail);
        userListPage.search(lecteurEmail);
        Assertions.assertThat(userListPage.userExistsInTable(lecteurEmail)).isTrue();

        BookListPage bookListPage = new BookListPage(driver);
        bookListPage.open();
        bookListPage.createBook(bookTitle, "Auteur Emprunt", TestDataFactory.uniqueIsbn(), "Test");
        Assertions.assertThat(bookListPage.bookExists(bookTitle)).isTrue();

        EmpruntListPage empruntListPage = new EmpruntListPage(driver);
        empruntListPage.open();
        empruntListPage.createEmpruntForUser(lecteurEmail, bookTitle);
        Assertions.assertThat(empruntListPage.tableContainsText(bookTitle)).isTrue();
        Assertions.assertThat(empruntListPage.tableContainsText(lecteurEmail)).isTrue();

        empruntListPage.returnFirstActiveLoan();
        empruntListPage.clickFilter("Historiques");
        Assertions.assertThat(empruntListPage.tableContainsText(bookTitle)).isTrue();
    }

    @Test
    void filtresEmprunts() {
        EmpruntListPage empruntListPage = new EmpruntListPage(driver);
        empruntListPage.open();

        empruntListPage.clickFilter("Tous");
        Assertions.assertThat(empruntListPage.isOnEmpruntsPage()).isTrue();

        empruntListPage.clickFilter("En cours");
        Assertions.assertThat(empruntListPage.isOnEmpruntsPage()).isTrue();

        empruntListPage.clickFilter("En retard");
        Assertions.assertThat(empruntListPage.isOnEmpruntsPage()).isTrue();

        empruntListPage.clickFilter("Historiques");
        Assertions.assertThat(empruntListPage.isOnEmpruntsPage()).isTrue();
    }
}
