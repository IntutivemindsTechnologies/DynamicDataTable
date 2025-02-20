let handleScroll = (event,isScrolledToBottom,enableInfiniteLoading,template,scrolled,component) => {

    if (event.target.scrollTop !== 0) {
        if (component.isScrolledToBottom(event.target) && !component.scrolled) {
            component.scrolled = true;
            if (component.enableInfiniteLoading) {
                component.showSubmit = false;
                console.log('edited ids before :',component.editedIds);
                component.editedIds = [];
                console.log('edited ids after :',component.editedIds);
                const allArrowIcons = component.template.querySelectorAll('lightning-icon');
                allArrowIcons.forEach(icon => {
                    icon.classList.remove('arrowIconShow');
                });
                const inputElement = component.template.querySelector('[data-id="searchInput"]');
                inputElement.value = '';
                component.showInput = false;
                component.loadMoreData();
            }
        }
    }
}
export {handleScroll};