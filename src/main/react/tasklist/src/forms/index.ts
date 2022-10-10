import ACustomForm from './ACustomForm';
import AnotherCustomForm from './AnotherCustomForm';
import { IFormViewer } from '../store/model';
import { Component, FC } from 'react';

const customForms: Map<string, FC<IFormViewer>> = new Map([
  ['aCustomForm', ACustomForm],
  ['anotherCustomForm', AnotherCustomForm]
]);

export default customForms;
