import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Input from '../../components/input/Input';
import Header from '../../components/header/Header';
import NewProperty from '../../components/new-property/NewProperty';
import NewPropertyManager from '../../components/new-property-manager/NewPropertyManager';
import Icon from '../../components/icon/Icon';
import Search from '../../components/search/Search';
import { ROUTES } from '../../constants/constants';
import { dummyUser, properties, propertyManagers } from '../../data';

import './NewTenantForm.scss'

class NewTenantForm extends Component {
  constructor(props) {
    super(props);

    this.handleSearch = this.handleSearch.bind(this);
    this.handleAddingNewPropertyManager = this.handleAddingNewPropertyManager.bind(this);
    this.handleSelectionFromSearch = this.handleSelectionFromSearch.bind(this);
    this.handleAddingNewProperty = this.handleAddingNewProperty.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      user: dummyUser,
      addingNewProperty: false,
      addingNewPropertyManager: false,
    }
  }

  handleSearch(event) {
    const { target } = event;
    const { id } = target;
    const { value } = target;
    this.setState({
      [id]: value
    })
  }

  handleSelectionFromSearch(searchedObj) {
    if(Object.keys(searchedObj).includes("address")) {
      this.setState({ propertySelected: searchedObj })
    } else {
      this.setState({ propertyManagerSelected: searchedObj })
      this.setState({ addingNewPropertyManager: false })
    }
  }

  handleAddingNewPropertyManager() {
    this.setState(prevState => ({addingNewPropertyManager: !prevState.addingNewPropertyManager}))
  }

  handleAddingNewProperty() {
    this.setState(prevState => ({addingNewProperty: !prevState.addingNewProperty}))
  }

  handleChange(event) {
    const { target } = event;
    const { name } = target;
    const { value } = target;

    this.setState({
      [name]: value
    });
  }

  render() {
    const { user, propertySelected, propertyManagerSelected, addingNewProperty, addingNewPropertyManager } = this.state;
    return (
      <div className="admin page">
        {// If the user isn't an Admin, Redirect back to the Root Route
          !user.role.isAdmin && <Redirect to={ROUTES.ROOT}/>
        }
        <Header>
          {() => (
            <Header.Label label="Add New Tenant" type="basic" />
          )}
        </Header>
        <div>
          <div className="width-wrapper">
            {/* Add new tenant form section
            ======================================= */}
            <section className="newTenantFormSection">
              <h2 className="newTenantFormHeading">Tenant Information</h2>
              <fieldset>
                <Input
                  id="firstName"
                  name="tenantFirstName"
                  label="First Name"
                  type="text"
                  placeholder="First Name"
                  onChange={this.handleChange} />
                <Input
                  id="lastName"
                  name="tenantLastName"
                  label="Last Name"
                  type="text"
                  placeholder="Last Name"
                  onChange={this.handleChange} />
                <Input
                  id="phoneNumber"
                  name="tenantPhone"
                  label="Phone"
                  type="tel"
                  placeholder="ex. 503-555-1234"
                  onChange={this.handleChange} />
              </fieldset>
            </section>

            {/* Add new property form
            ======================================= */}
            <section className="newTenantFormSection">
              <h2 className="newTenantFormHeading">Property</h2>
              <fieldset>
                <Search
                  id="propertyName"
                  label="Property Search"
                  onSearchSelection={this.handleSelectionFromSearch}
                  searchData={properties} />
              </fieldset>
            </section>
            <div className="propertySearchResults">
              {(!propertySelected &&
                !addingNewProperty) && (
                <div className="addNewLink">
                  <span className="addIcon" onClick={this.handleAddingNewProperty} role="presentation"><Icon icon="plus"/></span>
                  Add New Property
                </div>
              )}
              {propertySelected ?
                <div className="newTenantProperty">
                  <div>
                    <h3>{propertySelected.name.length > 0 ? propertySelected.name : null}</h3>
                    <p>{propertySelected.address.length > 0 ? propertySelected.address : null}</p>
                  </div>
                  {!addingNewProperty && (
                    <div className="editPropertyDetails">
                      <span className="editIcon" onClick={this.handleAddingNewProperty} role="presentation">
                        <Icon icon="pencil"/>
                      </span>
                      <p>edit</p>
                    </div>
                  )}
                </div>
              : null}
              {addingNewProperty && (
                <form>
                  <div className="propertyFormCloseButton">
                    {!propertySelected ? "Add new property" : "Edit new property"}
                    <span onClick={this.handleAddingNewProperty} role="presentation">
                      <Icon icon="close"/>
                    </span>
                  </div>
                  <NewProperty
                    id="propertySelected"
                    onChange={this.handleChange} />
                </form>
              )}
              {propertyManagerSelected && (
                <div className="newTenantProperty">
                  <div>
                    <h3>{propertyManagerSelected.name.length > 0 && propertyManagerSelected.name}</h3>
                    <p>{propertyManagerSelected.number.length > 0 && propertyManagerSelected.number}</p>
                  </div>
                  {!addingNewPropertyManager && (
                    <div className="editPropertyDetails">
                      <span className="editIcon" onClick={this.handleAddingNewPropertyManager} role="presentation">
                        <Icon icon="pencil"/>
                      </span>
                      <p>edit</p>
                    </div>
                  )}
                </div>
              )}
              {(propertySelected && !propertyManagerSelected) && (
                <div className="addNewLink" onClick={this.handleAddingNewPropertyManager} role="presentation">
                  <span className="addIcon"><Icon icon="plus"/></span>
                  Add new manager
                </div>
              )}
            </div>

            {/* Add new property manager form
            ======================================= */}
            {(addingNewPropertyManager &&
              propertySelected) && (
              <section className="newTenantFormSection">
                <h2 className="newTenantFormHeading">Property Manager</h2>
                <fieldset>
                  <Search
                    id="propertyManagerName"
                    label="Property Manager Search"
                    onSearchSelection={this.handleSelectionFromSearch}
                    searchData={propertyManagers} />
                </fieldset>
                <div className="propertySearchResults">
                  <form>
                    <div className="propertyFormCloseButton">
                      {!propertyManagerSelected ? "Add new manager" : "Edit property manager"}
                      <span onClick={this.handleAddingNewPropertyManager} role="presentation">
                        <Icon icon="close"/>
                      </span>
                    </div>
                    <NewPropertyManager onChange={this.handleChange} />
                  </form>
                </div>
              </section>
            )}
            {/* Add Unit Input
            ======================================= */}
            {propertySelected && (
              <section className="newTenantFormSection">
                <h2 className="newTenantFormHeading">Unit</h2>
                <Input
                  id="propertyUnit"
                  placeholder="Unit # / ABC..."
                  label="Unit"
                  type="text"/>
              </section>
            )}
            <section className="newTenantFormSection">
              <button type="submit" className="btn">Save</button>
            </section>
          </div>
        </div>
      </div>
    )
  }
}

export default NewTenantForm;
