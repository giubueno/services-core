describe("Explore", function() {
  var view;

  beforeEach(function() {
    view = new App.views.Explore();
  });
  
  describe("#$window", function() {
    it("should return $(window)", function() {
      expect(view.$window()).toEqual($(window));
    });
  });  
  
  describe("#isLoaderVisible", function() {
    describe("when loader is in visible portion of window", function() {
      beforeEach(function() {
        var w = {
          scrollTop: function(){
            return 1;
          },
          height: function(){
            return 1;
          }
        };
        spyOn(view.$loaderDiv, "offset").andReturn({top: 1});
        spyOn(view, "$window").andReturn(w);
      });
      it("should return true", function() {
        expect(view.isLoaderVisible()).toEqual(true);
      });
    });

    describe("when loader is not in visible portion of window", function() {
      beforeEach(function() {
        var w = {
          scrollTop: function(){
            return 1;
          },
          height: function(){
            return 0;
          }
        };
        spyOn(view.$loaderDiv, "offset").andReturn({top: 1});
        spyOn(view, "$window").andReturn(w);
      });
      it("should return false", function() {
        expect(view.isLoaderVisible()).toEqual(false);
      });
    });
  });  
  
  describe("#activate", function() {
    it("should assing loader", function() {
      expect(view.$loader).toEqual(jasmine.any(Object));
    });
    
    it("should assing false to EOF results", function() {
      expect(view.EOF).toEqual(false);
    });

    it("should assing results", function() {
      expect(view.$results).toEqual(jasmine.any(Object));
    });
    
    it("should assign default filters", function() {
      expect(view.filter).toEqual({
        recommended: true,
        not_expired: true,
        page: 2 //because activate calls fetchPage and increments the page
      });
    });
  });

  describe("#applyFilter", function() {
    var el;

    beforeEach(function() {
      el = $('<div>');
      el.data('filter', {foo: 'bar'});
      spyOn(view, "firstPage");
      view.applyFilter({target: el});
    });

    it("should assign filter to view", function() {
      expect(view.filter).toEqual({foo: 'bar'});
    });

    it("should call firstPage", function() {
      expect(view.firstPage).wasCalled();
    });
  });

  describe("#firstPage", function() {
    beforeEach(function() {
      view.EOF = true;
      view.filter.page = 2;
      spyOn(view, "fetchPage");
      spyOn(view.$results, "html");
      view.firstPage();
    });

    it("should assign false to EOF", function() {
      expect(view.EOF).toEqual(false);
    });

    it("should clear results", function() {
      expect(view.$results.html).wasCalledWith('');
    });

    it("assign 1 to filter.page", function() {
      expect(view.filter.page).toEqual(1);
    });

    it("should call fetchPage", function() {
      expect(view.fetchPage).wasCalled();
    });
  });  
  
  describe("#fetchPage", function() {
    describe("when EOF is true", function(){
      beforeEach(function() {
        view.EOF = true;
        spyOn(view.$loader, "show");
        view.fetchPage();
      });

      it("should not increment page", function() {
        expect(view.filter.page).toEqual(2);
      });

      it("should not show loader", function() {
        expect(view.$loader.show).wasNotCalled();
      });
    });

    describe("when EOF is false", function(){
      beforeEach(function() {
        view.EOF = false;
        spyOn(view.$loader, "show");
        view.fetchPage();
      });

      it("should increment page", function() {
        expect(view.filter.page).toEqual(3);
      });

      it("should show loader", function() {
        expect(view.$loader.show).wasCalled();
      });
    });
  });

  describe("#onSuccess", function() {
    beforeEach(function() {
      spyOn(view.$results, "append");
      spyOn(view.$loader, "hide");
      
      view.onSuccess('test data');
    });

    it("should append data to $results", function() {
      expect(view.$results.append).wasCalledWith('test data');
    });
    
    it("should show loader", function() {
      expect(view.$loader.hide).wasCalled();
    });
  });  

  describe("onScroll", function() {
    beforeEach(function() {
      spyOn(view, "fetchPage");
    });
    
    it("call fetchPage if $loader is inside the visible window", function() {
      spyOn(view, "isLoaderVisible").andReturn(true);
      view.onScroll();
      expect(view.fetchPage).wasCalled();
    });
    
    it("should not call fetchPage if $loader is outside the visible window", function() {
      spyOn(view, "isLoaderVisible").andReturn(false);
      view.onScroll();
      expect(view.fetchPage).wasNotCalled();
    });
    
  });  
  
});  

