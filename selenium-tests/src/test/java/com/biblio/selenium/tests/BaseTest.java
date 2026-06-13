package com.biblio.selenium.tests;

import com.biblio.selenium.config.TestConfig;
import com.biblio.selenium.config.WebDriverFactory;
import com.biblio.selenium.pages.ChangePasswordPage;
import com.biblio.selenium.pages.DashboardPage;
import com.biblio.selenium.pages.LoginPage;
import com.biblio.selenium.pages.NavbarPage;
import com.biblio.selenium.pages.UserListPage;
import com.biblio.selenium.utils.TestDataCleaner;
import com.biblio.selenium.utils.TestDataFactory;
import com.biblio.selenium.utils.WaitUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

import java.util.concurrent.atomic.AtomicBoolean;

public abstract class BaseTest {

    private static final AtomicBoolean STALE_DATA_CLEANED = new AtomicBoolean(false);

    protected WebDriver driver;
    protected LoginPage loginPage;
    protected NavbarPage navbarPage;

    @BeforeAll
    static void cleanStaleSeleniumData() {
        if (STALE_DATA_CLEANED.compareAndSet(false, true)) {
            TestDataCleaner.purgeSeleniumTestData();
        }
    }

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
        TestDataCleaner.purgeSeleniumTestData();
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
        loginPage.loginExpectingPasswordChange(email, TestDataFactory.defaultTemporaryPassword());
        ChangePasswordPage changePasswordPage = new ChangePasswordPage(driver);
        changePasswordPage.changePassword(
                TestDataFactory.defaultTemporaryPassword(),
                TestDataFactory.defaultPassword()
        );
        new DashboardPage(driver).waitUntilDisplayed();
        WaitUtils.waitForVisible(driver, By.xpath("//button[contains(.,'Déconnexion')]"));
    }
}
