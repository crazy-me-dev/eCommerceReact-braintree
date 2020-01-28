import styled from "styled-components";
import { mediaUI as media } from "../../utils/mediaQueriesBuilder";

export const ButtonContainer = styled.div`
  ${media.mobile`width: 50%;`}
  ${media.tablet`width: 30%;`}
  ${media.large` width: 20%;`}
  ${media.wide`width: 15%;`}
`;

/**this values are taken from semantic UI label */
export const LabelCustom = styled.label`
  display: block;
  margin: 0 0 0.28571429rem 0;
  color: rgba(0, 0, 0, 0.87);
  font-size: 0.92857143em;
  font-weight: 700;
  text-transform: none;
`;

export const ButtonLink = styled.button`
  background: none !important;
  border: none;
  padding: 0 !important;
  font-family: arial, sans-serif;
  color: #21897b;
  text-decoration: underline;
  cursor: pointer;
`;
