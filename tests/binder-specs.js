describe('binder', function() {
    var binder, model, documentStub, scopeElement, element, element2;

    beforeEach(function() {
        model = new DataBind.Model("scope");
        model.attr('prop', 'myValue');
        model.attr('check', true);

        documentStub = sinon.stub({querySelector: function() {}});
        scopeElement = sinon.stub({querySelectorAll: function() {}});
        scopeElement.querySelectorAll.withArgs('[data-click]').returns([]);
        scopeElement.querySelectorAll.withArgs('[data-class]').returns([]);
        documentStub.querySelector.withArgs('[data-scope=scope]').returns(scopeElement);
        binder = new DataBind.Binder(model, documentStub);
    });

    describe('bind', function() {
        describe('has value property', function() {
            beforeEach(function() {
                element = sinon.stub({getAttribute: function() {}, tagName: '', value: ''});
                element.getAttribute.withArgs('data-bind').returns('prop');
                scopeElement.querySelectorAll.withArgs('[data-bind]').returns([element]);
            });

            it('should set value', function() {
                binder.bind();
                expect(element.value).toEqual('myValue');
            });
        });

        describe('checkbox', function() {
            beforeEach(function() {
                element = sinon.stub({getAttribute: function() {}, type: 'checkbox', tagName: '', checked: false});
                element.getAttribute.withArgs('data-bind').returns('check');
                scopeElement.querySelectorAll.withArgs('[data-bind]').returns([element]);
            });

            it('should set checked', function() {
                binder.bind();
                expect(element.checked).toEqual(true);
            });
        });

        describe('select', function() {
            beforeEach(function() {
                element = sinon.stub({getAttribute: function() {}, tagName: 'SELECT', checked: false});
                element.getAttribute.withArgs('data-bind').returns('prop');
                scopeElement.querySelectorAll.withArgs('[data-bind]').returns([element]);
            });

            it('should set value', function() {
                binder.bind();
                expect(element.value).toEqual('myValue');
            });
        });

        describe('radio', function() {
            beforeEach(function() {
                element = sinon.stub({getAttribute: function() {}, type: 'radio', value: 'wrongValue', tagName: '', checked: false});
                element.getAttribute.withArgs('data-bind').returns('prop');
                element2 = sinon.stub({getAttribute: function() {}, type: 'radio', value: 'myValue', tagName: '', checked: false});
                element2.getAttribute.withArgs('data-bind').returns('prop');
                scopeElement.querySelectorAll.withArgs('[data-bind]').returns([element, element2]);
            });

            it('should set checked', function() {
                binder.bind();
                expect(element.checked).toEqual(false);
                expect(element2.checked).toEqual(true);
            });
        });

        describe('not an input element', function() {
            beforeEach(function() {
                element = sinon.stub({getAttribute: function() {}, tagName: ''});
                element.getAttribute.withArgs('data-bind').returns('prop');
                scopeElement.querySelectorAll.withArgs('[data-bind]').returns([element]);
            });

            it('should set innerHTML', function() {
                binder.bind();
                expect(element.innerHTML).toEqual('myValue');
            });
        });
    });
});