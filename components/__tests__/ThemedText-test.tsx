import * as React from "react";
import { Text } from "react-native";
import renderer from "react-test-renderer";
import Index from "../../app/index";

it(`renders correctly`, () => {
  const tree = renderer.create(<Index />).toJSON();

  expect(tree).toMatchSnapshot();
});
