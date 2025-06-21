// Finish the code here.
// Feel free to modify any of the code in this project, this is just a starting point if it's helpful.
import { useRef, useState, useId } from "react";
import { DropdownDataList } from "./data";

type ComboBoxProps = {
  data: DropdownDataList;
  label: string;
  ariaLabel?: string;
  showLabel?: boolean;
  onSelect?: (value: string) => void;
};

export const ComboBox = ({
  data,
  label,
  ariaLabel,
  showLabel = true,
  onSelect,
}: ComboBoxProps) => {
  const comboBoxRef = useRef<HTMLDivElement>(null!);
  const inputFieldRef = useRef<HTMLInputElement>(null!);
  const [inputValue, setInputValue] = useState<string>("");
  const [isOpenListbox, setIsOpenListbox] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const filteredData = data.filter((option) =>
    option.label.toLowerCase().startsWith(inputValue.toLowerCase())
  );

  // In case there are multiple combobox in the same page
  const comboboxId = useId();

  const scrollIfActive = (el: HTMLLIElement | null, index: number) => {
    if (index === activeIndex && el) {
      el.scrollIntoView({ block: "nearest" });
    }
  };

  const handleFocusIn = () => {
    setIsOpenListbox(true);
  };

  const handleFocusOut = () => {
    setTimeout(() => {
      const active = document.activeElement;
      if (!comboBoxRef.current.contains(active)) {
        setIsOpenListbox(false);
        setActiveIndex(-1);
      }
    }, 0);
  };

  const handleClick = (e: React.MouseEvent<HTMLUListElement>) => {
    const target = e.target as HTMLElement;
    const value = target.getAttribute("data-value");
    if (!value) return;

    setInputValue(value!);
    setIsOpenListbox(false);
    if (onSelect) onSelect(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.code) {
      case "ArrowUp":
        setActiveIndex((prev) => Math.max(prev - 1, 0));
        setIsOpenListbox(true);
        break;
      case "ArrowDown":
        setActiveIndex((prev) => Math.min(prev + 1, filteredData.length - 1));
        setIsOpenListbox(true);
        break;
      case "Enter":
      case "NumpadEnter":
        let value = "";
        if (activeIndex >= 0 && activeIndex < filteredData.length) {
          value = filteredData[activeIndex].value;
        } else {
          value = inputValue;
        }
        setInputValue(value);
        setIsOpenListbox(false);
        if (onSelect) onSelect(value);
        // inputFieldRef.current.focus(); // I already forgot why I need this
        break;
      case "Escape":
        setActiveIndex(-1);
        setIsOpenListbox(false);
        break;
      default:
        setActiveIndex(-1);
        setIsOpenListbox(true);
        break;
    }
  };

  return (
    <div
      ref={comboBoxRef}
      className="combobox"
      onFocus={handleFocusIn}
      onBlur={handleFocusOut}
      onKeyDown={handleKeyDown}
    >
      {showLabel && <label htmlFor={`cb${comboboxId}-input`}>{label}</label>}
      <div className="input-field-wrapper">
        <input
          ref={inputFieldRef}
          id={`cb${comboboxId}-input`}
          className="input-field"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          role="combobox"
          aria-controls={`cb${comboboxId}-listbox`}
          aria-expanded={isOpenListbox}
          aria-activedescendant={
            filteredData[activeIndex]
              ? `cb${comboboxId}-option-${filteredData[activeIndex].value}`
              : ""
          }
          aria-autocomplete="list"
          aria-label={showLabel ? "" : ariaLabel ? ariaLabel : label}
        />
        <button
          id={`cb${comboboxId}-button`}
          type="button"
          tabIndex={-1}
          aria-label={ariaLabel ? ariaLabel : label}
          aria-controls={`cb${comboboxId}-listbox`}
          aria-expanded={isOpenListbox}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="18px"
            height="18px"
          >
            <path
              fill="currentColor"
              d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6l-6-6z"
            ></path>
          </svg>
        </button>
      </div>
      {isOpenListbox && (
        <ul
          id={`cb${comboboxId}-listbox`}
          className="listbox"
          tabIndex={-1}
          onClick={handleClick}
          role="listbox"
        >
          {filteredData.length ? (
            filteredData.map((option, index) => (
              <li
                ref={(el) => scrollIfActive(el, index)}
                id={`cb${comboboxId}-option-${option.value}`}
                key={`cb${comboboxId}-option-${option.value}`}
                className={index === activeIndex ? "highlight" : ""}
                data-value={option.value}
                role="option"
                aria-selected={index === activeIndex ? true : false}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="option-disabled" role="option" aria-disabled="true">
              No results
            </li>
          )}
        </ul>
      )}
    </div>
  );
};
