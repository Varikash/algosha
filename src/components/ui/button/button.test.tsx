import React from "react";
import renderer from "react-test-renderer";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";

describe('Button component', () => {
  it('Отрисовывает кнопку с текстом', () => {
    const component = renderer.create(<Button text="Развернуть" />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Отрисовывает кнопку без текста', () => {
    const component = renderer.create(<Button  text=""/>)
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Отрисовывает неактивную кнопку', () => {
    const component = renderer.create(<Button text="Развернуть" disabled={true} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Отрисовывает кнопку с loader', () => {
    const component = renderer.create(<Button text="Развернуть" isLoader={true} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Триггерит колбэк при нажатии на кнопку', () => {
    window.alert = jest.fn();
    render(<Button text="Развернуть" onClick={() => alert('Кнопка нажата')} />);

    fireEvent.click(screen.getByText('Развернуть'));
    expect(window.alert).toHaveBeenCalledTimes(1);
  });




})