
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import axios from 'axios'
import ItemsForABandStatistics from "../../components/AdminPanel/ItemsForABandStatistics";
jest.mock("axios")

describe('Admin Panel Testing', () => {
    let container = null;
   


    beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
    });

    afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
    });

    it('expect the bands list to correctly give default value', async () => {

        await act(async () => {
            render(<ItemsForABandStatistics items={[{bandName: 'Emmure'},{bandName: 'Test'}]} />, container);
          });
          expect(container.querySelector("#bandsList").value).toBe('default')
        });

        it('expect to get correct message on change of select', async () => {
            const data = {
                status: 200,
                data: 'The band Test has 2 Items in the website'
            }
    
            axios.get.mockImplementationOnce(() => Promise.resolve(data))
    
            await act(async () => {
                render(<ItemsForABandStatistics items={[{bandName: 'Emmure'},{bandName: 'Test'}]} />, container);
                
            });
            const bandsSelect = container.querySelector("#bandsList")
            
            bandsSelect.onclick = function() {
                bandsSelect.selectedIndex = 1;
            }
            act(() => {
                bandsSelect.dispatchEvent(new MouseEvent("click", { bubbles: true }));
            });
            
            expect(container.querySelector("#bandsList").value).toBe('Emmure')
        });
    })

