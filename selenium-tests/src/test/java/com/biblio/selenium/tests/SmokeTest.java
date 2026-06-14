package com.biblio.selenium.tests;

import com.biblio.selenium.pages.BookListPage;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

class SmokeTest extends BaseTest {

    @Test
    void cataloguePublicAccessibleSansConnexion() {
        BookListPage bookListPage = new BookListPage(driver);
        bookListPage.open();

        Assertions.assertThat(navbarPage.getTitle()).contains("Nuur Library Management");
        Assertions.assertThat(bookListPage.isDisplayed()).isTrue();
        Assertions.assertThat(navbarPage.isLoginLinkVisible()).isTrue();
        Assertions.assertThat(navbarPage.isCatalogueLinkVisible()).isTrue();
    }
}
