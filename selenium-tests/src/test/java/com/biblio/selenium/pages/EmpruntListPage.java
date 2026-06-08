package com.biblio.selenium.pages;

import com.biblio.selenium.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.Select;

public class EmpruntListPage extends BasePage {

    private static final By PAGE_TITLE = By.xpath("//h2[contains(text(),'Emprunts')]");
    private static final By NEW_EMPRUNT_BUTTON = By.xpath("//button[contains(.,'Nouvel emprunt')]");
    private static final By EMPRUNTS_TABLE = By.cssSelector(".emprunts-table");

    public EmpruntListPage(WebDriver driver) {
        super(driver);
    }

    public void open() {
        navigateTo("/emprunts");
    }

    public boolean isOnEmpruntsPage() {
        return driver.getCurrentUrl().contains("/emprunts") && isDisplayed(PAGE_TITLE);
    }

    public boolean isDisplayed() {
        return isOnEmpruntsPage();
    }

    public void clickFilter(String filterName) {
        click(By.xpath("//button[text()='" + filterName + "']"));
        WaitUtils.waitForPageLoad(driver);
    }

    public void clickNewEmprunt() {
        click(NEW_EMPRUNT_BUTTON);
        WaitUtils.waitForVisible(driver, By.cssSelector(".create-form"));
    }

    public void createEmpruntForUser(String userEmail, String bookTitle) {
        clickNewEmprunt();
        new Select(driver.findElement(By.xpath("//form[contains(@class,'create-form')]//select[1]")))
                .selectByVisibleText(findOptionContaining(userEmail));
        new Select(driver.findElement(By.xpath("//form[contains(@class,'create-form')]//select[2]")))
                .selectByVisibleText(findBookOptionContaining(bookTitle));
        click(By.xpath("//form[contains(@class,'create-form')]//button[contains(.,\"Créer l'emprunt\")]"));
        WaitUtils.waitForPageLoad(driver);
    }

    private String findOptionContaining(String email) {
        return driver.findElements(By.xpath("//form[contains(@class,'create-form')]//select[1]/option"))
                .stream()
                .map(option -> option.getText())
                .filter(text -> text.contains(email))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Lecteur introuvable : " + email));
    }

    private String findBookOptionContaining(String bookTitle) {
        return driver.findElements(By.xpath("//form[contains(@class,'create-form')]//select[2]/option"))
                .stream()
                .map(option -> option.getText())
                .filter(text -> text.contains(bookTitle))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Livre introuvable : " + bookTitle));
    }

    public void returnFirstActiveLoan() {
        click(By.cssSelector("[data-testid='emprunt-return']"));
        WaitUtils.acceptAlertIfPresent(driver);
        WaitUtils.waitForPageLoad(driver);
    }

    public boolean tableContainsText(String text) {
        WaitUtils.waitForVisible(driver, EMPRUNTS_TABLE);
        return driver.findElement(EMPRUNTS_TABLE).getText().contains(text);
    }
}
