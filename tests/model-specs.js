describe('model', function() {
    var model;

    beforeEach(function() {
        model = new DataBind.Model("my scope");
    });

    it('should set the scope', function() {
        expect(model.scope).toEqual("my scope");
    });

    describe('calling attr with array index', function() {
        var valueChanged;
        beforeEach(function() {
            valueChanged = sinon.spy();
            model.setValueChanged(valueChanged);
            model.attr('items', [0]);
        });

        it('should update value in array', function() {
            model.attr('items[0]', 5);
            expect(model.get('items[0]')).toEqual(5);
            expect(valueChanged.calledWith('items[0]')).toBeTruthy();
        });
    });

    describe('pushing to array', function() {
        var valueChanged;
        beforeEach(function() {
            valueChanged = sinon.spy();
            model.setValueChanged(valueChanged);
            model.attr('arr', [0]);
            model.get('arr').push(1);
        });

        it('should call value changed', function() {
            expect(valueChanged.calledWith('arr')).toBeTruthy();
            expect(valueChanged.calledTwice).toBeTruthy();
        });

        it('should push to array', function() {
            expect(model.get('arr').value).toEqual([0, 1]);
        });
    });

    describe('pushing to inner array', function() {
        var valueChanged;
        beforeEach(function() {
            valueChanged = sinon.spy();
            model.setValueChanged(valueChanged);
            model.attr('arr', {inner: [1]});
            valueChanged.reset()

            model.get('arr.inner').push(2);
        });

        it('should call value changed', function() {
            expect(valueChanged.calledWith('arr.inner')).toBeTruthy();
        });

        it('should call value changed for parent object', function() {
            expect(valueChanged.calledWith('arr')).toBeTruthy();
        });

        it('should push to array', function() {
            expect(model.get('arr.inner').value).toEqual([1, 2]);
        });
    });

    describe('calling attr with dot property syntax', function() {
        var valueChanged;
        beforeEach(function() {
            valueChanged = sinon.spy();
            model.setValueChanged(valueChanged);
            model.attr('object', {firstName: ''});
        });

        it('should update property on object', function() {
            model.attr('object.firstName', 'john');
            expect(model.get('object.firstName')).toEqual('john');
            expect(valueChanged.calledWith('object.firstName')).toBeTruthy();
        });
    });

    describe('calling attr with multiple layers of dot property syntax and array indexing', function() {
        var valueChanged;
        beforeEach(function() {
            valueChanged = sinon.spy();
            model.setValueChanged(valueChanged);
            model.attr('object', {items: [{firstName: ''}]});
        });

        it('should update property on object', function() {
            model.attr('object.items[0].firstName', 'john');
            expect(model.get('object.items[0].firstName')).toEqual('john');
            expect(valueChanged.calledWith('object.items[0].firstName')).toBeTruthy();
        });
    });

    describe('getting object graph', function() {
        it('should dig into object', function() {
            model.attr('object', {prop: 'value'})
            expect(model.get('object.prop')).toEqual('value');
        });

        it('should dig into object graph two levels deep', function() {
            model.attr('object', {prop: {prop2: 'value'}});
            expect(model.get('object.prop.prop2')).toEqual('value');
        });

        it('should handle computed property in object graph', function() {
            model.computed('computed', function() {return {computedProp: 4}});
            expect(model.get('computed.computedProp')).toEqual(4);
        });

        it('should handle array access at beginning', function() {
            model.attr('items', [{number: 0}, {number: 1}]);
            expect(model.get('items[1].number')).toEqual(1);
        });

        it('should handle array access in middle', function() {
            model.attr('object', {arr: [{number: 0}, {number: 1}]});
            expect(model.get('object.arr[0].number')).toEqual(0);
        });

        it('should handle variable array access at beginning', function() {
            model.attr('index', 1);
            model.attr('items', [0, 1]);
            expect(model.get('items[index]')).toEqual(1);
        });
    });

    describe('computed properties with dependencies', function() {
        var valueChanged;
        beforeEach(function() {
            model.attr('a', 1);
            valueChanged = sinon.spy();
            model.setValueChanged(valueChanged);
            model.computed('b', function() {
                return this.get('a');
            });
            model.computed('c', function() {
                return this.get("b");
            });

            model.attr('a', 2);
        });

        it('should trigger value changed for this attr', function() {
            expect(valueChanged.calledWith('a')).toBeTruthy();
        });

        it('should trigger value changed for dependent properties', function() {
            expect(valueChanged.calledWith('b')).toBeTruthy();
            expect(valueChanged.calledWith('c')).toBeTruthy();
        });

        it('should get computed value', function() {
            expect(model.get('c')).toEqual(2);
        });
    });

    describe('computed property with a parameter', function() {
        var methodSpy;

        beforeEach(function() {
            methodSpy = sinon.spy();

            model.attr('arg1', 'value1');
            model.attr('arg2', 'value2');
            model.computed('func', methodSpy);
        });

        it('should pass parameter', function() {
            model.get('func(arg1, arg2)');

            expect(methodSpy.calledWith('value1', 'value2')).toBeTruthy();
        });
    });
});