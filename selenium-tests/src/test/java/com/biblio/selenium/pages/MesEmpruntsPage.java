package com.biblio.selenium.pages;

import com.biblio.selenium.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class MesEmpruntsPage extends BasePage {

    private static final By PAGE_TITLE = By.xpath("//h2[text()='Mes emprunts']");
    private static final By EMPRUNTS_TABLE = By.cssSelector(".emprunts-table");
    private static final By EMPTY_STATE = By.cssSelector(".empty-state");

    public MesEmpruntsPage(WebDriver driver) {
        super(driver);
    }

    public void open() {
        navigateTo("/mes-emprunts");
    }

    public boolean isDisplayed() {
        return isDisplayed(PAGE_TITLE);
    }

    public boolean hasEmpruntWithStatus(String status) {
        if (isDisplayed(EMPTY_STATE)) {
            return false;
        }
        return driver.findElement(EMPRUNTS_TABLE).getText().contains(status);
    }

    public boolean tableContainsBook(String bookTitle) {
        return getTableText().contains(bookTitle);
    }

    public String getTableText() {
        WaitUtils.waitForVisible(driver, EMPRUNTS_TABLE);
        return driver.findElement(EMPRUNTS_TABLE).getText();
    }

    public void waitForBookInTable(String bookTitle) {
        WaitUtils.createWait(driver).until(d -> tableContainsBook(bookTitle));
    }
}
