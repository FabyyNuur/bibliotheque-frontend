package com.biblio.selenium.tests;

import com.biblio.selenium.pages.DashboardPage;
import com.biblio.selenium.pages.EmpruntListPage;
import com.biblio.selenium.pages.LoginPage;
import com.biblio.selenium.pages.UserListPage;
import com.biblio.selenium.utils.TestDataFactory;
import com.biblio.selenium.utils.WaitUtils;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.support.ui.ExpectedConditions;

class RbacTest extends BaseTest {

    @Test
    void lecteurRedirigeDepuisUsersVersDashboard() {
        String email = TestDataFactory.uniqueEmail("rbac");
        new com.biblio.selenium.pages.RegisterPage(driver).open();
        new com.biblio.selenium.pages.RegisterPage(driver)
                .register("Rbac", "User", email, TestDataFactory.defaultPassword());

        UserListPage userListPage = new UserListPage(driver);
        userListPage.open();
        WaitUtils.createWait(driver).until(ExpectedConditions.not(ExpectedConditions.urlContains("/users")));
        WaitUtils.waitForPageLoad(driver);

        Assertions.assertThat(driver.getCurrentUrl()).doesNotContain("/users");
        Assertions.assertThat(userListPage.isOnUsersPage()).isFalse();
    }

    @Test
    void lecteurRedirigeDepuisEmpruntsVersDashboard() {
        String email = TestDataFactory.uniqueEmail("rbac2");
        new com.biblio.selenium.pages.RegisterPage(driver).open();
        new com.biblio.selenium.pages.RegisterPage(driver)
                .register("Rbac2", "User", email, TestDataFactory.defaultPassword());

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
