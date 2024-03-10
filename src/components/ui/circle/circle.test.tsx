import React from 'react';
import renderer from 'react-test-renderer';
import { Circle } from './circle';
import { ElementStates } from "../../../types/element-states";

describe('Circle component', () => {
  it("Рендерит circle с буквой", () => {
    const tree = renderer.create(<Circle letter="J" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Рендерит circle без буквы", () => {
    const tree = renderer.create(<Circle letter="" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  
  it("Рендерит circle с head", () => {
    const tree = renderer.create(<Circle head="head" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  
  it("Рендерит circle с react-элементом в head", () => {
    const tree = renderer
      .create(<Circle head={<Circle isSmall={true} />} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  
  it("Рендерит circle с tail", () => {
    const tree = renderer.create(<Circle tail="tail" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Рендерит circle с react-элементом в tail', () => {
    const tree = renderer.create(<Circle tail={<Circle isSmall={true} />} />).toJSON();
    expect(tree).toMatchSnapshot();
  })
  
  it("Рендерит circle с index", () => {
    const tree = renderer.create(<Circle index={7} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  
  it("Рендерит circle с пропом isSmall ===  true", () => {
    const tree = renderer.create(<Circle isSmall={true} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  
  it("Рендерит circle в состоянии default", () => {
    const tree = renderer
      .create(<Circle state={ElementStates.Default} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  
  it("Рендерит circle в состоянии changing", () => {
    const tree = renderer
      .create(<Circle state={ElementStates.Changing} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  
  it("Рендерит circle в состоянии modified", () => {
    const tree = renderer
      .create(<Circle state={ElementStates.Modified} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });





})