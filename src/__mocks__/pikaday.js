const setDate = jest.fn();

const Pikaday = jest.fn().mockImplementation(() => {
    return {
        getDate: () => {},
        gotoDate: () => {},
        setDate,
        setMaxDate: () => {},
        setMinDate: () => {},
        isVisible: () => false,
        show: () => {},
        hide: () => {},
        destroy: () => {},
    };
});

export { setDate };
export default Pikaday;
