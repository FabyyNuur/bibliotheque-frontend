package com.biblio.selenium.tests;

import com.biblio.selenium.pages.EmpruntListPage;
import com.biblio.selenium.pages.LoginPage;
import com.biblio.selenium.pages.UserListPage;
import com.biblio.selenium.utils.WaitUtils;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.support.ui.ExpectedConditions;

class RbacTest extends BaseTest {

    @Test
    void lecteurRedirigeDepuisUsersVersDashboard() {
        loginAsBiblio();
        String email = createLecteurAsBiblio("Rbac", "User");
        navbarPage.logout();
        loginAsNewLecteur(email);

        UserListPage userListPage = new UserListPage(driver);
        userListPage.open();
        WaitUtils.createWait(driver).until(ExpectedConditions.not(ExpectedConditions.urlContains("/users")));
        WaitUtils.waitForPageLoad(driver);

        Assertions.assertThat(driver.getCurrentUrl()).doesNotContain("/users");
        Assertions.assertThat(userListPage.isOnUsersPage()).isFalse();
    }

    @Test
    void lecteurRedirigeDepuisEmpruntsVersDashboard() {
        loginAsBiblio();
        String email = createLecteurAsBiblio("Rbac2", "User");
        navbarPage.logout();
        loginAsNewLecteur(email);

        EmpruntListPage empruntListPage = new EmpruntListPage(driver);
        empruntListPage.open();
        WaitUtils.createWait(driver).until(ExpectedConditions.not(ExpectedConditions.urlContains("/emprunts")));
        WaitUtils.waitForPageLoad(driver);

        Assertions.assertThat(driver.getCurrentUrl()).doesNotContain("/emprunts");
        Assertions.assertThat(empruntListPage.isOnEmpruntsPage()).isFalse();
    }

    @Test
    void routeProtegeeRedirigeVersLogin() {
        UserListPage userListPage = new UserListPage(driver);
        userListPage.open();

        LoginPage login = new LoginPage(driver);
        Assertions.assertThat(login.isDisplayed()).isTrue();
    }
}
