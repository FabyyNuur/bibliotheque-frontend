package com.biblio.selenium.tests;

import com.biblio.selenium.config.TestConfig;
import com.biblio.selenium.config.WebDriverFactory;
import com.biblio.selenium.pages.ChangePasswordPage;
import com.biblio.selenium.pages.LoginPage;
import com.biblio.selenium.pages.NavbarPage;
import com.biblio.selenium.pages.UserListPage;
import com.biblio.selenium.utils.TestDataFactory;
import com.biblio.selenium.utils.WaitUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public abstract class BaseTest {

    protected WebDriver driver;
    protected LoginPage loginPage;
    protected NavbarPage navbarPage;

    @BeforeEach
    void setUpDriver() {
        driver = WebDriverFactory.createDriver();
        driver.manage().window().maximize();
        loginPage = new LoginPage(driver);
        navbarPage = new NavbarPage(driver);
    }

    @AfterEach
    void tearDownDriver() {
        if (driver != null) {
            driver.quit();
        }
    }

    protected void loginAsBiblio() {
        loginAs(TestConfig.getBiblioEmail(), TestConfig.getBiblioPassword());
    }

    protected void loginAs(String email, String password) {
        loginPage.open();
        loginPage.login(email, password);
        WaitUtils.waitForVisible(driver, By.xpath("//button[contains(.,'Déconnexion')]"));
    }

    protected String createLecteurAsBiblio(String nom, String prenom) {
        String email = TestDataFactory.uniqueEmail("lecteur");
        UserListPage userListPage = new UserListPage(driver);
        userListPage.open();
        userListPage.createUser(nom, prenom, email);
        return email;
    }

    protected void loginAsNewLecteur(String email) {
        loginPage.open();
        loginPage.login(email, TestDataFactory.defaultTemporaryPassword());
        ChangePasswordPage changePasswordPage = new ChangePasswordPage(driver);
        changePasswordPage.changePassword(
                TestDataFactory.defaultTemporaryPassword(),
                TestDataFactory.defaultPassword()
        );
        WaitUtils.waitForVisible(driver, By.xpath("//button[contains(.,'Déconnexion')]"));
    }
}
