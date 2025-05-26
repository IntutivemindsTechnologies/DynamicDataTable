let handleOptionSelect = (event, component) => {

  component.lastUpdatedTime = new Date();

  component.interval = setInterval(() => {
    component.lastUpdatedTime = new Date(component.lastUpdatedTime);
  }, 60000);
  component.selectedLabel = event.currentTarget.dataset.label;
  component.dropdownOpen = false;
  if (component.selectedLabel == 'Write own query') {
    component.soqlTextBox = true;
    component.soqlLoadData = false;
  }
  else {
    component.soqlLoadData = true;
    component.soqlTextBox = false;
    const label = event.currentTarget.dataset.label;
    const value = event.currentTarget.dataset.value;
    component.successToastMessage = false;
    component.toggleIdColumn = true;
    component.rowSize = 10;
    component.rowOffset = 0;
    component.queryDropdownData = value;
  }
}

export { handleOptionSelect };