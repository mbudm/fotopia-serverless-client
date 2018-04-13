import React from 'react';
import { S3Image } from 'aws-amplify-react';
import useAuth from '../util/useAuth';

const renderLocal = (props) => (<img src={props.imgLocation} alt="" className="img-responsive"/>);
const renderRemote = (props) => (<S3Image imgKey={props.imgKey} level="private"/>);

const Image = (props) => useAuth() ? renderRemote(props) : renderLocal(props);
export default Image;
