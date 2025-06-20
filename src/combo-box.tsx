// Finish the code here.
// Feel free to modify any of the code in this project, this is just a starting point if it's helpful.
import { useRef, useEffect, useState, useId } from "react";
import { DropdownDataList } from "./data";

/**
 * TODO:
 * - add accessibilities
 * - last functionalities and behavior check
 * - set z-index of listbox
 */

type ComboBoxProps = {
  data: DropdownDataList;
  onSelect?: (value: string) => void;
};

export const ComboBox = ({ data, onSelect }: ComboBoxProps) => {
  const comboBoxRef = useRef<HTMLDivElement>(null!);
  const inputFieldRef = useRef<HTMLInputElement>(null!);
  const listboxRef = useRef<HTMLUListElement>(null!);
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
        if (activeIndex >= 0 && activeIndex < filteredData.length) {
          const value = filteredData[activeIndex].value;
          setInputValue(value);
          setIsOpenListbox(false);
          if (onSelect) onSelect(value);
        }
        inputFieldRef.current.focus();
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
      />
      {isOpenListbox && (
        <ul
          // ref={listboxRef}
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
            <li>No results</li>
          )}
        </ul>
      )}
    </div>
  );
};
