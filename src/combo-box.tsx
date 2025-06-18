// Finish the code here.
// Feel free to modify any of the code in this project, this is just a starting point if it's helpful.
import { useRef, useEffect, useState } from "react";
import { DropdownDataList } from "./data";

type ComboBoxProps = {
  data: DropdownDataList;
};

export const ComboBox = ({ data }: ComboBoxProps) => {
  const comboBoxRef = useRef<HTMLDivElement>(null!);
  const inputFieldRef = useRef<HTMLInputElement>(null!);
  const listboxRef = useRef<HTMLUListElement>(null!);
  const [inputValue, setInputValue] = useState<string>("");
  const [isOpenListbox, setIsOpenListbox] = useState<boolean>(false);

  const handleFocusIn = () => {
    setIsOpenListbox(true);
  };

  const handleFocusOut = () => {
    setTimeout(() => {
      const active = document.activeElement;
      if (!comboBoxRef.current.contains(active)) {
        setIsOpenListbox(false);
      }
    }, 0);
  };

  const handleClick = (e: React.MouseEvent<HTMLUListElement>) => {
    const target = e.target as HTMLElement;
    const value = target.getAttribute("data-value");
    // console.log(value);
    setInputValue(value!);
    setIsOpenListbox(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div
      ref={comboBoxRef}
      className="combobox"
      onFocus={handleFocusIn}
      onBlur={handleFocusOut}
    >
      <input
        // ref={inputFieldRef}
        className="input-field"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
      />
      {isOpenListbox && (
        <ul
          // ref={listboxRef}
          className="listbox"
          role="listbox"
          tabIndex={-1}
          onClick={handleClick}
        >
          {data
            .filter((option) =>
              option.label.toLowerCase().startsWith(inputValue.toLowerCase())
            )
            .map((option) => (
              <li key={option.value} role="option" data-value={option.value}>
                {option.label}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
